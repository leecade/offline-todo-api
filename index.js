var express = require('express');
var Datastore = require('nedb');
var todos = require('./lib/todos');

var db = new Datastore({ filename: 'todos', autoload: true });
express()
  .use('/todos', todos(db))
  .listen(3000);
