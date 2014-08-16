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

describe('conflict resolution', function() {
  var id;
  var now = Date.now();
  it('after creating a normal todo', function(done) {
    request(app)
      .post('/todos')
      .send({ text: 'Wash the dishes', updated: now })
      .expect(201)
      .end(function(err, res) {
        id = res.text;
        done(err);
      });
  });

  it('should accept PUTs that have more recent updated times', function(done) {
    request(app)
      .put('/todos/'+id)
      .send({ text: 'Wash the dishes and walk the dog', updated: now+10 })
      .expect(204, '', done);
  });

  it('should accept PUTs that have equal updated times and no change to content', function(done) {
    request(app)
      .put('/todos/'+id)
      .send({ text: 'Wash the dishes and walk the dog', updated: now+10 })
      .expect(204, '', done);
  });

  // If two clients provide the same updated time but different content - the winner
  // is the one that 'gets in first'
  it('should reject PUTs that have equal updated times but changes to content', function(done) {
    request(app)
      .put('/todos/'+id)
      .send({ text: 'Walk the dog', updated: now+10 })
      .expect(409, '', done);
  });

  it('should reject DELETEs that have equal updated times but changes to content', function(done) {
    request(app)
      .delete('/todos/'+id)
      .send({ text: 'Walk the dog', updated: now+10 })
      .expect(409, '', done);
  });

  it('should reject DELETEs that have old updated times', function(done) {
    request(app)
      .delete('/todos/'+id)
      .send({ text: 'Wash the dishes and make a sandwich', updated: now+5 })
      .expect(409, '', done);
  });

  it('should reject PUTs that have old updated times', function(done) {
    request(app)
      .put('/todos/'+id)
      .send({ text: 'Wash the dishes and make a sandwich', updated: now+5 })
      .expect(409, done);
  });

  it('after deleting the todo', function(done) {
    request(app)
      .delete('/todos/'+id)
      .send({ text: 'Wash the dishes and walk the dog', updated: now+10 })
      .expect(202, '', done);
  });

  it('DELETEs to already deleted todos should be accepted', function(done) {
    request(app)
      .delete('/todos/'+id)
      .send({ text: 'Wash the dishes and walk the dog', updated: now+10 })
      .expect(202, done);
  });
});
