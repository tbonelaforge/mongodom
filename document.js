var _ = require('underscore');
var classify = require('./classify');
var Retrievable = require('./retrievable');

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

  },
  instanceMethods : {
    traverse : function(path, fields, callback) {
      var self = this;
      var axisSpecifier = null;
      var axis = null;

      if (!path.length) {
//        return self.getFields(fields, callback);
        return self.getFields(
          {
            fields : fields,
            isArray : false
          },
          callback
        );
      }
      axisSpecifier = path.shift();
      self.retrieveWhole(function(err, data) {
        if (err) {
          return callback(err);
        }
        self._data = data[0];
//        self._context[self._id] = self;
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

//    getFields : function(fields, isArray, callback) {
/*
    getFields : function(options, callback) {
console.log("Inside Document.getFields, got called:\n");
      var self = this;
      var fields = options.fields;
      var isArray = options.isArray;

      self.retrieve(fields, function(err, data) {
        if (err) {
          return callback(err);
        }
        self._data = (isArray) ? data : data[0];
        callback(null, self);
      });
    },
*/  
    getAxis : function() {
      throw new Error("getAxis unimplemented");
    },

    _storeInContext : function() {
      if (!this._context[this._collectionName]) {
        this._context[this._collectionName] = {};
      }
      this._context[this._collectionName][this._id] = this;
    }
  }
});

module.exports = Document;
