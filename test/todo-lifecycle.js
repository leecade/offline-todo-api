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

describe('a todo lifecycle', function() {
  var now = Date.now();
  it('POST /todos should allow creation of a todo', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', _id: String(now) })
      .expect(201, done);
  });

  it('GET /todos should return just created todo in an array', function(done) {
     request(app)
       .get('/todos')
       .set('Accept', 'application/json')
       .expect(200, [{ _id: String(now), text: 'Wash the dishes' }], done);
  });

  it('GET /todos/:id should return just that todo', function(done) {
     request(app)
       .get('/todos/'+String(now))
       .set('Accept', 'application/json')
       .expect(200, { _id: String(now), text: 'Wash the dishes' }, done);
  });

  it('PUT /todos/:id should not update that todo and should return nothing', function(done) {
     request(app)
       .put('/todos/'+String(now))
       .send({ text: 'Wash the dishes and cook some pasta' })
       .expect(405, '', done);
  });

  it('GET /todos/:id should return the un-updated todo', function(done) {
     request(app)
       .get('/todos/'+String(now))
       .expect(200, { _id: String(now), text: 'Wash the dishes' }, done);
  });

  it('DELETE /todos/:id should delete that todo and return nothing', function(done) {
     request(app)
       .delete('/todos/'+String(now))
       .expect(204, '', done);
  });

  it('DELETE /todos/:id should delete that todo and return nothing', function(done) {
     request(app)
       .delete('/todos/'+(now))
       .expect(204, '', done);
  });

  it('PUT /todos/:id should not be able to recreate a todo that had previously existed', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', _id: String(now) })
      .expect(410, done);
  });

  it('POST /todos/:id should not be able to recreate a todo that had previously existed', function(done) {
    request(app)
      .post('/todos')
      .send({ _id: String(now), text: 'Wash the dishes' })
      .expect(410, done);
  });

  it('GET /todos/:id should respond with 410 if requesting a todo that previously existed', function(done) {
    request(app)
      .get('/todos/'+(now))
      .expect(410, done);
  });
});
