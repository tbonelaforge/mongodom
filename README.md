The idea is Make querying multiple mongodb collections appear as if you're querying one giant network data structure.

Example URL:

GET /objects/3/things/5?fields={"object":{"cost" : 1},"subthings":{"name":1}}

This should find the object with identifier '3', and then link to the thing related to that object, having identifier '5'.  Then, from there, it should construct a JSON document having two fields: object and subthings.  The value of the "object" field would be filled by object number 3's cost, and the value of the  "subthings" field would be an array of all subthings related to object 3, thing 5, filtered to include only their names.

TODO: Add cache object, which is populated during the "path" portion of the traversal, and queried during the "fields" part of the traversal.