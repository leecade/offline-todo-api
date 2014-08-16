var EventEmitter = require('events').EventEmitter;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
module.exports = todos;

function _idToCreated(todo) {
  todo.created = todo._id;
  delete todo._id;
  return todo;
}

function todos(db) {
  var eventEmitter = new EventEmitter();
  eventEmitter.setMaxListeners(0);

  router.post(bodyParser.urlencoded({ extended: false }));
  router.put(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.route('/')
    
    // Get all todos
    .get(function(req, res) {
      db.find({}, function(err, docs) {
        res.json(docs.map(_idToCreated));
      });
    })

    // Create a todo
    .post(function(req, res) {
      if (req.body.text && req.body.updated && req.body.created) {
        db.findOne({ _id: parseInt(req.param('created'), 10) }, function(err, doc) {
          if (doc) {
            res.status(409).send();
          } else {
            db.insert({ _id: parseInt(req.body.created, 10), text: req.body.text, updated: req.body.updated }, function(err, newDoc) {
              eventEmitter.emit('update');
              res.status(201).send();
            });
          }
        });
      } else {
        res.status(400).send();
      }
    });

  router.route('/:created')

    // Get one todo by its created timestamp
    .get(function(req, res) {
      db.findOne({ _id: parseInt(req.param('created'), 10) }, function(err, doc) {
        if (doc) res.json(_idToCreated(doc));
        else res.status(404).end();
      });
    })

    // Update a todo
    .put(function(req, res) {
      if (req.body.text && req.body.updated) {
        db.findOne({ _id: parseInt(req.param('created'), 10) }, function(err, doc) {
          if (doc && doc.updated === req.body.updated && doc.text === req.body.text) {
            res.status(204).end();
          } else if (doc && doc.updated >= req.body.updated) {
            res.status(409).end();
          } else {
            db.update({ _id: parseInt(req.param('created'), 10) }, { text: req.body.text, updated: req.body.updated }, {}, function() {
              eventEmitter.emit('update');
              res.status(doc ? 204 : 201).end();
            });
          }
        });
      } else {
        res.status(400).send();
      }
    })

    // Delete a todo
    .delete(function(req, res) {
      if (req.body.text && req.body.updated) {
        db.findOne({ _id: parseInt(req.param('created')) }, function(err, doc) {
          if (doc && (doc.updated > req.body.updated || doc.text !== req.body.text)) {
            res.status(409).end();
          } else {
            db.remove({ _id: parseInt(req.param('created'), 10) }, {}, function(err, removed) {
              eventEmitter.emit('update');
              res.status(202).end();
            });
          }
        });
      } else {
        res.status(400).end();
      }
    });

  app.get('/stream', function(req, res) {
    var messageCount = 0;
    req.socket.setTimeout(Infinity);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    function onUpdate() {
      messageCount++;
      res.write('id: ' + messageCount + '\n');
      res.write('data: update\n\n');
    }

    eventEmitter.addListener('update', onUpdate);
    req.on('close', function() {
      eventEmitter.removeListener('update', onUpdate);
    });
  });

  app.use(router);
  return app;
}
