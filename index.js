var express = require('express');
var Datastore = require('nedb');
var todos = require('./lib/todos');
var cors= require('cors');
var port = Number(process.env.PORT || 3000);

var db = new Datastore({ filename: 'todos', autoload: true });
express()
  .use(cors())
  .use('/todos', todos(db))
  .listen(port);
console.log('listening on '+port);
