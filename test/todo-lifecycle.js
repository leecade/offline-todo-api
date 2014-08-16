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
      .send({ text: 'Wash the dishes', created: now, updated: now })
      .expect(201, done);
  });

  it('PUT /todos/:created should also allow creation of a todo', function(done) {
    request(app)
      .put('/todos/'+(now+10))
      .send({ text: 'Wash the dishes', updated: now+10 })
      .expect(201, done);
  });

  it('GET /todos should return just created todo in an array', function(done) {
     request(app)
       .get('/todos')
       .set('Accept', 'application/json')
       .expect(200, [{ created: now, text: 'Wash the dishes', updated: now }, { created: now+10, text: 'Wash the dishes', updated: now+10 }], done);
  });

  it('GET /todos/:created should return just that todo', function(done) {
     request(app)
       .get('/todos/'+now)
       .set('Accept', 'application/json')
       .expect(200, { created: now, text: 'Wash the dishes', updated: now }, done);
  });

  it('PUT /todos/:created should update that todo and return nothing', function(done) {
     request(app)
       .put('/todos/'+now)
       .send({ text: 'Wash the dishes and cook some pasta', updated: now+10 })
       .expect(204, '', done);
  });

  it('GET /todos/:created should return the updated todo', function(done) {
     request(app)
       .get('/todos/'+now)
       .expect(200, { created: now, text: 'Wash the dishes and cook some pasta', updated: now+10 }, done);
  });

  it('DELETE /todos/:created should delete that todo and return nothing', function(done) {
     request(app)
       .delete('/todos/'+now)
       .send({ text: 'Wash the dishes and cook some pasta', updated: now+10 })
       .expect(202, '', done);
  });

  it('DELETE /todos/:created should delete that todo and return nothing', function(done) {
     request(app)
       .delete('/todos/'+(now+10))
       .send({ text: 'Wash the dishes', updated: now+10 })
       .expect(202, '', done);
  });

  it('PUT /todos/:created should not be able to recreate a todo that had previously existed', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', created: now, updated: now })
      .expect(410, done);
  });

  it('POST /todos/:created should not be able to recreate a todo that had previously existed', function(done) {
    request(app)
      .put('/todos/'+(now+10))
      .send({ text: 'Wash the dishes', updated: now+10 })
      .expect(410, done);
  });
});
