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
      var refererent = null;

      if (!this.referencedModels || !this.referencedModels[key]) {
        return null;
      }
      referent = this.referencedModels[key];
      if (typeof referent !== 'function') {
        this.referencedModels[key] = require('./' + referent);
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
      var selectObject = self.makeSelectObject(fields);

      return self.getFields(
        {
          fields : selectObject,
          isArray : false
        },
        function(err) {
          if (err) {
            return callback(err);
          }
          try {
            self._traverseAllFields({fields : fields}, callback);
          } catch(e) {
            callback(e);
          }
        }
      );      
    },

    _traverseAllFields : function(options, callback) {
      var self = this;
      var fields = options.fields;
      var document = null;
      var referencedDocument = null;
      var iterator = null;
      var nextIterator = null;
      var selectObject = null;
      var pair = null;

      if (!options.stack) {
        options.stack = [self, new ObjectIterator(fields)];
      }
      if (!options.stack.length) {
        return callback(null, self);
      }
      iterator = options.stack[options.stack.length - 1];
      document = options.stack[options.stack.length - 2];
      pair = iterator.getNextPair();
      if (!pair) {
        options.stack.pop(); // Used-up iterator.
        options.stack.pop(); // processed document.
        return self._traverseAllFields(options, callback);
      }
      if (typeof pair.value !== 'object') { // This field needs no populating.
        return self._traverseAllFields(options, callback);
      }

      // Assume the fields are valid for this document.
      referencedDocument = document.getReference(pair.key);
      if (!referencedDocument) {
        return self._traverseAllFields(options, callback);
        
      }
      options.fields = pair.value;
      nextIterator = new ObjectIterator(options.fields);
      selectObject = referencedDocument.makeSelectObject(options.fields);
      referencedDocument.retrieve(selectObject, function(err, data) {
        document.set(pair.key, data[0]);
        options.stack.push(referencedDocument);
        options.stack.push(nextIterator);
        self._traverseAllFields(options, callback);
      });
    },

    _storeInContext : function() {
      if (!this._context[this._collectionName]) {
        this._context[this._collectionName] = {};
      }
      this._context[this._collectionName][this._id] = this;
    },

    makeSelectObject : function(fields, stack) {
      var self = this;
      var selectObject = {};
      
      if (!stack) {
        stack = [];
      }
      _.each(fields, function(value, key) {
        if (self._getReferencedModel(key)) {
          selectObject[key] = 1;
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
