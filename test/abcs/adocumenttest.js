var assert = require('chai').assert;
var ADocument = require('./adocument');
var CDocument = require('./cdocument');
var async = require('async');
var as = require('./as.json');
var cs = require('./cs.json');
var testFixtures = [
  { Document : ADocument, data : as },
  { Document : CDocument, data : cs }
];

function ensureTestFixture(testFixture, callback) {
  var Document = testFixture.Document;
  var data     = testFixture.data;

  Document.getCollection(function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove(function(err) {
      if (err) {
        return callback(err);
      }
      async.each(
        data, 
        function(datum, next) {
          collection.insert(datum, next);
        },
        callback
      );
    });
  });
}






describe('ADdocument', function() {
  before(function(done) {
    async.each(
      testFixtures, 
      function(testFixture, next) {
        ensureTestFixture(testFixture, next);
      },
      done
    );
  });
  describe('traverse', function() {
    it("Should get all the c's underneath it, with all the fields", function(done) {
      var aDocument = new ADocument({
        criteria : {
          id : 1
        }
      });
      aDocument.traverse(
        ['cs'], 
        {
          id : 1
        },
        function(err, document) {
          assert.equal(err, null, "Got no error");
          assert.deepEqual(document.getData(), [ { _id: "534b77794dc9d270599c35c8", id: 1 } ]);
          done();
        });
    }); // End get all c's case.

    it("Should get cs/1, with the id fields.", function(done) {
      var aDocument1 = new ADocument({
        criteria : {
          id : 1
        }
      });
      
      aDocument1.traverse(
        ['cs', '1'],
        {
          id : 1
        },
        function(err, document) {
          assert.equal(err, null, "Got no error");
          assert.deepEqual(document.getData(), { _id: "534b77794dc9d270599c35c8", id: 1 });
          done();
        }
      )
    }); // End get c_1 case.    


    it("Should get cs/1, and retrieve fields deeply.", function(done) {
      var aDocument1 = new ADocument({
        criteria : {
          id : 1
        }
      });
      
      aDocument1.traverse(
        ['cs', '1'],
        {
          id : 1,
          a : {
            id : 1
          }
        },
        function(err, document) {
          assert.equal(err, null, "Got no error");
          assert.deepEqual(document.getData(), { 
            _id: "534b77794dc9d270599c35c8",
            id: 1,
            a: { 
              _id: "534b77794dc9d270599c35c6", id: 1 
            } 
          });
          done();
        }
      )
    }); // End use traversed objects to retrieve fields case.
  });
  
  after(function(done) {
    async.eachSeries(
      testFixtures,
      function(testFixture, next) {
        testFixture.Document.getCollection(function(err, collection) {
          if (err) {
            return done(err);
          }
          collection.drop(next);
        });
      },
      done
    );
  });
  
});
