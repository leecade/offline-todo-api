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

describe('api when empty', function() {
  it('GET /todos responds with an empty JSON array', function(done) {
    request(app)
      .get('/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, [], done);
  });

  it('GET /todos/:created responds with 404', function(done) {
    request(app)
      .get('/todos/doesnotexist')
      .expect(404, '', done);
  });
});
