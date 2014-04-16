var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var classify = require('./classify');

var db = null;

function getDB(callback) {
  if (db) {
    return callback(null, db);
  }
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, connection) {
    if (err) {
      console.log("Error connecting to mongo server.");
      throw err;
    }
    db = connection;
    callback(null, db);
  });
}

var Retrievable = classify({
  name : 'Retrievable',
  inherits : [],
  initialize : function(options) {
    this._collectionName = options.collectionName || this._getCollectionName();
    this._data = options.data || null;
    this._criteria = options.criteria || {};
    this._context = options.context || {};
  },
  classMethods : {
    _collection : null,
    getCollectionName : function() {
      throw new Error("getCollectionName Unimplimented");
    },
    getCollection : function(callback) {
      var self = this;
      
      if (self._collection) {
        return callback(null, self._collection);
      }
      getDB(function(err, db) {
        if (err) {
          return callback(err);
        }
        self._collection = db.collection(self.getCollectionName());
        callback(null, self._collection);
      });
    }
  },

  instanceMethods : {
    getCriteria : function() {
      return this._criteria;
    },

    getFields : function(options, callback) {
      var self = this;

      self.retrieve(options.fields, function(err, data) {
        if (err) {
          return callback(err);
        }
        self._data = (options.isArray) ? data : data[0];
        callback(null, self);
      });
    },
    
    retrieve : function(fields, callback) {
      var self = this;

      self._getCollection(function(err, collection) {
        if (err) {
          return callback(err);
        }
        if (fields) {
          collection.find(self._criteria, fields).toArray(callback);
        } else {
          collection.find(self._criteria).toArray(callback);
        }
      });
    },

    retrieveWhole : function(callback) {
      return this.retrieve(null, callback);
      
    },

    _getCollectionName : function() {
      return this.constructor.getCollectionName();
    },

    _getCollection : function(callback) {
      return this.constructor.getCollection(callback);
    }
  }
});

module.exports = Retrievable;
