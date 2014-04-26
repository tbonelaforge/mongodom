var _ = require('underscore');
var classify = require('classify');
var Document = require('../../document');
var ADocument = require('./adocument');

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
      'a' : 'ADocument'
    }

  },
  instanceMethods : {
    
  }
});

module.exports = CDocument;
