var _ = require('underscore');
var classify = require('classify');
var Document = require('../../document');
var CAxis = require('./caxis');

var ADocument = classify({
  name : 'ADocument',
  inherits : [Document],
  initialize : function(options) {},
  classMethods : {
    getCollectionName : function() {
      return 'as';
    }
  },
  instanceMethods : {
    getAxis : function(name) {
      switch (name) {
        case 'cs' :
        return CAxis;
        break;
      default :
        throw new Error("'A' documents have no " + name + " axis defined.");
      };
    }
  }
});


module.exports = ADocument;
