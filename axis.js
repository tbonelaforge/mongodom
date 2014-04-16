var _ = require('underscore');
var classify = require('classify');
var Retrievable = require('./retrievable');

var Axis = classify({
  name            : 'Axis',
  inherits        : [Retrievable],
  initialize      : function(options) {
    this._type = 'axis';
  },
  classMethods    : {
    getParentName : function() {
      throw new Error("getParentName unimplimented");
    },
    getDocument : function() {
      throw new Error("GetDocument unimplemented");
    }
  },
  instanceMethods : {
    find : function(path, fields, callback) {
      var id = null;
      var document = null;

      if (!path.length) {
//        return this.getFields(fields, callback);
        return this.getFields(
          {
            fields : fields,
            isArray : true
          },
          callback
        );
      }
//      id = path.shift();
      id = Number(path.shift());
      document = this.document(id);
      document.traverse(path, fields, callback);
    },

    document : function(id) {
      var Document = this.getDocument();

      return new Document({
        collectionName : this._collectionName,
        criteria : _.extend(this._criteria, {
          id : id
        }),
        context : this._context
      });
    },

    getDocument : function() {
      return this.constructor.getDocument();
    },
    /*
    getFields : function(fields, callback) {
      var self = this;

      self.retrieve(fields, function(err, data) {
        if (err) {
          return callback(err);
        }
        self._data = data;
        callback(null, self);
      });
    }
*/
  }
});

module.exports = Axis;
