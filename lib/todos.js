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
      db.find({ deleted: { $ne: true } }, function(err, docs) {
        res.json(docs.map(_idToCreated));
      });
    })

    // Create a todo
    .post(function(req, res) {
      if (req.body.text && req.body.created) {
        db.findOne({ _id: parseInt(req.param('created'), 10) }, function(err, doc) {
          if (doc) {
            res.status(doc.deleted ? 410 : 409).send();
          } else {
            db.insert({ _id: parseInt(req.body.created, 10), text: req.body.text }, function(err, newDoc) {
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
        if (doc && !doc.deleted) res.json(_idToCreated(doc));
        else res.status(doc && doc.deleted ? 410 : 404).end();
      });
    })

    // Update a todo
    .put(function(req, res) {
      if (req.body.text) {
        db.findOne({ _id: parseInt(req.param('created'), 10) }, function(err, doc) {
          if (doc && doc.deleted) {
            res.status(410).end();
          } else if (doc) {

            // Don't yet support edits
            res.status(405).end();
          } else {
            db.insert({ _id: parseInt(req.param('created'), 10), text: req.body.text }, function(err, newDoc) {
              eventEmitter.emit('update');
              res.status(201).end();
            });
          }
        });
      } else {
        res.status(400).send();
      }
    })

    // Delete a todo
    .delete(function(req, res) {
      db.findOne({ _id: parseInt(req.param('created')) }, function(err, doc) {
        if (doc) {
          doc.deleted = true;
          db.update({ _id: parseInt(req.param('created'), 10) }, doc, function(err, removed) {
            eventEmitter.emit('update');
            res.status(204).end();
          });
        } else {
          res.status(204).end();
        }
      });
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
