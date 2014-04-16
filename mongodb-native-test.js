var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var getDB = (function() {
  var db = null;

  return function getDB(callback) {
    if (db) {
      return callback(db);
    }
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, connection) {
      if (err) {
        console.log("Error connecting to mongo server.");
        throw err;
      }
      db = connection;
      callback(db);
    });
  };
}());

var a1 = {
  id : 1,
  bs : [
    {
      id : 1
    },
    {
      id : 2
    }
  ]
};

var a2 = {
  id : 2,
  bs : [
    {
      id : 3
    }
  ]
};

var c1 = {
  id : 1,
  a : 1
};

var c2 = {
  id : 2,
  a : 2
};

var c3 = {
  id : 3,
  a : 2
};

function setupAs(callback) {
  getDB(function(db) {
    var aCollection = db.collection('as');
    aCollection.remove(function(err) {
      if (err) {
        console.log("Error removing the 'a's");
        return callback(err);
      }
      async.eachSeries(
        [a1, a2], 
        function(a, next) {
          aCollection.insert(a, next);
        },
        callback
      );
    });
  });
}

function setupCs(callback) {
  getDB(function(db) {
    var cCollection = db.collection('cs');
    cCollection.remove(function(err) {
      if (err) {
        console.log("Error removing the 'c's");
        return callback(err);
      }
      async.eachSeries(
        [c1, c2, c3],
        function(c, next) {
          cCollection.insert(c, next);
        },
        callback
      );
    });
  });
}

setupAs(function(err) {
  if (err) {
    console.log("Error setting up the As...");
    throw(err);
  }
  setupCs(function(err) {
    if (err) {
      console.log("Error setting up the Cs...");
      throw(err);
    }
    console.log("Successfully setup the data (check mongo shell)");
//    process.exit(1);
    getDB(function(db) {
      if (err) {
        console.log("ERror getting db\n");
        process.exit(1);
      }
      db.collection('as').find({id:1}).toArray(function(err, results) {
        console.log("Got results:\n", results);
        process.exit(1);
      });
    });
  });
});
