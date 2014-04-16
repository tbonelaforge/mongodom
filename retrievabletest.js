var Retrievable = require('./retrievable.js');
var util = require('util');

console.log("Retrievable is:\n", Retrievable);

Retrievable.prop = 'bar';

Retrievable.toString = function() { return util.inspect(this); };

console.log("After adding bar, Retrievable is:\n", Retrievable);
console.log("Inspecting Retrievable gives:\n", util.inspect(Retrievable));
console.log("The result of calling cm1 on Retrievable is:\n", Retrievable.cm1());



var retrievable = new Retrievable({
  collectionName : 'collectionName',
  collection : 'collection',
  criteria : 'criteria',
  data : 'data',
  context : 'context'
});

console.log("The newly-constructed retrievable instance is:\n", retrievable);
console.log("The result of calling im1 on retrievable is:\n", retrievable.im1());

