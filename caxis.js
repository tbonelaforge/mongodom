var _ = require('underscore');
var classify = require('classify');
var Axis = require('./axis');
var CDocument = require('./cdocument');

var CAxis = classify({
  name : 'CAxis',
  inherits : [Axis],
  initialize : function() {
//    this._collectionName = 'cs';
  },
  classMethods : {
    getCollectionName : function() {
      return 'cs';
    },
    getDocument : function() {
      return CDocument;
    },
    getParentName : function(name) {
      switch (name) {
        case 'as' :
        return 'a';
        break;
      default :
        throw new Error("collection " + name + " Is not a parent for CAxes.");
        break;
      }
    }
  },
  instanceMethods : {
    
  }
});

module.exports = CAxis;
