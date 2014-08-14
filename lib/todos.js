var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
module.exports = todos;

function todos(db) {
  router.post(bodyParser.urlencoded({ extended: false }));
  router.put(bodyParser.urlencoded());
  router.use(bodyParser.json());

  router.route('/')
    
    // Get all todos
    .get(function(req, res) {
      db.find({}, function(err, docs) {
        res.json(docs);
      });
    })

    // Create a todo
    .post(function(req, res) {
      db.insert({ text: req.body.text }, function(err, newDoc) {
        res.status(200).send(newDoc._id);
      });
    });

  router.route('/:id')

    // Get one todo by its id
    .get(function(req, res) {
      db.findOne({ _id: req.param('id') }, function (err, doc) {
        res.json(doc);
      });
    })

    // Update a todo
    .put(function(req, res) {
      db.update({ _id: req.param('id') }, { text: req.body.text }, {}, function() {
        res.status(200).end();
      });
    })

    // Delete a todo
    .delete(function(req, res) {
      db.remove({ _id: req.param('id') }, {}, function(err, removed) {
        if (err || !removed) res.status(404).end();
        else res.status(200).end();
      });
    });

  app.use(router);
  return app;
}
