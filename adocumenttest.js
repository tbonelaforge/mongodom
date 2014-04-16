var ADocument = require('./adocument');

console.log("Just loaded ADocument:\n", ADocument);
console.log("ADocument's prototype object is:\n", ADocument.prototype);
console.log("About to construct a new instance of ADocument, passing options:\n", { criteria : { id : 1 } } );
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
  function(err, data) {
    if (err) {
      console.log("There was an error traversing from a1:\n", err);
      process.exit(1);
    }
    console.log("The result of the traversal is:\n", data);
//    process.exit(0);
    
    console.log("about to traverse from a/1 to cs/1");
    aDocument1 = new ADocument({
      criteria : {
        id : 1
      }
    });
    aDocument1.traverse(
      ['cs', '1'],
      {
        id : 1
      },
      function(err, data) {
        if (err) {
          console.log("There was an error traversing from a/1 to cs/1\n");
          process.exit(1);
        }
        console.log("The result of traversing from a/1 to cs/1 is:\n", data);
        process.exit(0);
      }
    )
    
  }
);


