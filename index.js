var express = require('express');
var Datastore = require('nedb');
var todos = require('./lib/todos');
var cors= require('cors');

var db = new Datastore({ filename: 'todos', autoload: true });
express()
  .use(cors())
  .use('/todos', todos(db))
  .listen(3000);
