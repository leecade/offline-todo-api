// Test bits
var request = require('supertest');

// Component under test
var todos = require('../lib/todos');

// Scaffolding and mocking
var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = new Datastore();
app.use('/todos', todos(db));

describe('creating multiple todos with the same id', function() {
  var now = Date.now();
  it('after creating a normal todo', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', _id: String(now) })
      .expect(201, done);
  });

  it('should not allow the creation of another todo with the same id', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', _id: String(now) })
      .expect(409, done);
  });

  it('after deleting the todo', function(done) {
    request(app)
      .delete('/todos/'+String(now))
      .expect(204, done);
  });
});
