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
  it('POST /todos should allow creation of a todo', function(done) {
    var req = request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes' })
      .expect(200)
      .end(function(err, res) {
        id = res.text;
        done(err);
      });
  });
  it('GET /todos should return just created todo in an array', function(done) {
     request(app)
       .get('/todos')
       .set('Accept', 'application/json')
       .expect(200, [{ _id: id, text: 'Wash the dishes' }], done);
  });
  it('GET /todos/:id should return just that todo', function(done) {
     request(app)
       .get('/todos/'+id)
       .set('Accept', 'application/json')
       .expect(200, { _id: id, text: 'Wash the dishes' }, done);
  });
  it('DELETE /todos/:id should delete that todo', function(done) {
     request(app)
       .delete('/todos/'+id)
       .expect(200, '', done);
  });
});
