var express = require('express');
var Datastore = require('nedb');
var todos = require('./lib/todos');
var cors= require('cors');
var port = Number(process.env.PORT || 3000);

var db = new Datastore({ filename: 'todos', autoload: true });
express()
  .use(cors())
  .get('/', function(req, res) {
    res.redirect(302, 'https://github.com/matthew-andrews/offline-todo-api');
  })
  .use('/todos', todos(db))
  .listen(port);
console.log('listening on '+port);
