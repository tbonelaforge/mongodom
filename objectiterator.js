var _ = require('underscore');
var classify = require('classify');

var ObjectIterator = classify({
  name : 'ObjectIterator',
  initialize : function(options) {
    this._object = options;
    this._keys = _.keys(this._object);
    this._position = -1;
  },
  instanceMethods : {
    getNextPair : function() {
      this._position += 1;
      if (this._position >= this._keys.length) {
        return null;
      }
      return {
        key : this._getCurrentKey(),
        value : this._getCurrentValue()
      }
    },
    _getCurrentKey : function() {
      return this._keys[this._position];
    },
    _getCurrentValue : function() {
      return this._object[this._getCurrentKey()];
    }
  }
});

module.exports = ObjectIterator;
