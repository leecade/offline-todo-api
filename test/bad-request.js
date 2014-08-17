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

describe('bad requests to the api', function() {
  it('Empty POST to /posts return 400', function(done) {
    request(app)
      .post('/todos')
      .expect(400, [], done);
  });

  it('POST without _id return 400', function(done) {
    request(app)
      .post('/todos')
      .send({ text: "I don't have the time" })
      .expect(400)
      .end(function(err, res) {
        id = res.text;
        done(err);
      });
  });

  it('PUT without text time return 400', function(done) {
    request(app)
      .put('/todos/blahblah')
      .send({})
      .expect(400, done);
  });
});
