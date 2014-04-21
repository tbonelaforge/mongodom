var _ = require('underscore');
var classify = require('classify');
var Retrievable = require('./retrievable');
var ObjectIterator = require('./objectiterator');

var Document = classify({
  name            : 'Document',
  inherits        : [Retrievable],
  initialize      : function() {
    var criteria = this.getCriteria();

    if (!criteria.id) {
      throw new Error("Document must have identifying criteria.");
    }
    this._id = criteria.id;
    this._type = 'document';
  },
  classMethods    : {
    getReferencedModel : function(key) {
      if (!this.referencedModels || !this.referencedModels[key]) {
        return null;
      }
      if (typeof this.referencedModels[key] !== 'function') {
        this.referencedModels[key] = require('./' + key);
      }
      return this.referencedModels[key];
    }
  },
  instanceMethods : {
    traverse : function(path, fields, callback) {
      var self = this;
      var axisSpecifier = null;
      var axis = null;

      if (!path.length) {
        return self._endTraversal(fields, callback);
      }
      axisSpecifier = path.shift();
      self.retrieveWhole(function(err, data) {
        if (err) {
          return callback(err);
        }
        self._data = data[0];
        self._storeInContext();
        axis = self.axis(axisSpecifier);
        axis.find(path, fields, callback);
      });
    },

    axis : function(specifier) {
      var Axis = this.getAxis(specifier);
      var axisParentName = Axis.getParentName(this._collectionName);
      var axisCriteria = {};

      axisCriteria[axisParentName] = this._id;
      return new Axis({
        context : this._context,
        criteria : axisCriteria
      });
    },

    getAxis : function() {
      throw new Error("getAxis unimplemented");
    },

    getReference : function(key) {
      var ReferencedModel = this._getReferencedModel(key);

      if (!ReferencedModel) {
        return null;
      }
      return new ReferencedModel({
        criteria : {
          id : this._data[key]
        }
      });
    },

    _getReferencedModel : function(key) {
      return this.constructor.getReferencedModel(key);
    },

    _endTraversal : function(fields, callback) {
      var self = this;
      var selectObject = self._makeSelectObject(fields);
      
      return self.getFields(
        {
          fields : selectObject,
          isArray : false
        },
        function(err) {
          if (err) {
            return callback(err);
          }
          self._traverseAllFields(fields, callback);
        }
      );      
    },

    _traverseAllFields : function(fields, callback) {
      var self = this;
      var document = self;
      var referencedDocument = null;
      var iterator = new ObjectIterator(fields);
      var nextIterator = null;
      var stack = [document, iterator];
      var pair = null;

      (function recurse() {
        var referencedDocument = null;
        var nextIterator = null;
        var selectObject = null;
        
        if (!stack.length) {
          return callback(null, self);
        }
        iterator = stack.pop();
        document = stack.pop();
        pair = iterator.getNextPair();
        if (!pair) {
          stack.pop(); // Used-up iterator
          stack.pop(); // processed document
          return recurse();
        }
        if (typeof pair.value !== 'object') {
          return recurse();
        }
        referencedDocument = document.getReference(pair.key);
        if (!referencedDocument) {
          return recurse();
        }
        fields = pair.value;
        nextIterator = new ObjectIterator(fields);
        selectObject = referencedDocument.makeSelectObject(fields);
        referencedDocument.retrieve(selectObject, function(err, data) {
          document.set(pair.key, data);
          stack.push(referencedDocument);
          stack.push(nextIterator);
        });
      }());      
    },

    _storeInContext : function() {
      if (!this._context[this._collectionName]) {
        this._context[this._collectionName] = {};
      }
      this._context[this._collectionName][this._id] = this;
    },

    _makeSelectObject : function(fields, stack) {
      var self = this;
      var selectObject = {};
      
      if (!stack) {
        stack = [];
      }
      _.each(fields, function(value, key) {
        if (self.getReference(key)) {
          return;
        }
        stack.push(key);
        if (typeof value === 'object') {
          _.extend(selectObject, self.makeSelectObject(value, stack));
        } else if (value) {
          selectObject[stack.join('.')] = 1;
        }
        stack.pop();
      });
      return selectObject;
    }
  }
});

module.exports = Document;
