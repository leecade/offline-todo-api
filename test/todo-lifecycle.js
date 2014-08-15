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
  var id;
  var now = Date.now();
  it('POST /todos should allow creation of a todo', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', updated: now })
      .expect(201)
      .end(function(err, res) {
        id = res.text;
        done(err);
      });
  });

  it('GET /todos should return just created todo in an array', function(done) {
     request(app)
       .get('/todos')
       .set('Accept', 'application/json')
       .expect(200, [{ _id: id, text: 'Wash the dishes', updated: now }], done);
  });

  it('GET /todos/:id should return just that todo', function(done) {
     request(app)
       .get('/todos/'+id)
       .set('Accept', 'application/json')
       .expect(200, { _id: id, text: 'Wash the dishes', updated: now }, done);
  });

  it('PUT /todos/:id should update that todo', function(done) {
     request(app)
       .put('/todos/'+id)
       .send({ text: 'Wash the dishes and cook some pasta', updated: now+10 })
       .expect(200, done);
  });

  it('GET /todos/:id should return the updated todo', function(done) {
     request(app)
       .get('/todos/'+id)
       .expect(200, { _id: id, text: 'Wash the dishes and cook some pasta', updated: now+10 }, done);
  });

  it('DELETE /todos/:id should delete that todo', function(done) {
     request(app)
       .delete('/todos/'+id)
       .expect(200, '', done);
  });
});
