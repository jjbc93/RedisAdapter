node-redis-adapter
==================

This adapter provides some extra functionality for the node redis library

Install with:

    npm install node-redis-adapter

## Usage Example


You should simply require the adapter by specifying the prefix of the application and letting it do the rest.

```js
var redis = require("redis"),
    client = redis.createClient(),
    redis_adapter = require("node-redis-adapter")("myapp"); 

```



### Prefix

The library allows you to add a prefix to the redis variables so they can not interfere with those of other applications.

Once indicated the prefix in the requirement, it is added automatically.



### Null and undefined

The library autoparse the stringify 'null', and 'undefined' values to the real null and undefined values.