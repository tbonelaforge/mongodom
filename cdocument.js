var _ = require('underscore');
var classify = require('classify');
var Document = require('./document');

var referencedModels = {
  
};

var CDocument = classify({
  name : 'CDocument',
  inherits : [Document],
  initialize : function() {},
  classMethods : {
    getCollectionName : function() {
      return 'cs';
    },
    referencedModels : {

    }

  },
  instanceMethods : {
    
  }
});

module.exports = CDocument;
