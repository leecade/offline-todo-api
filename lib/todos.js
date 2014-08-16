var EventEmitter = require('events').EventEmitter;
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
module.exports = todos;

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
        res.json(docs);
      });
    })

    // Create a todo
    .post(function(req, res) {
      if (req.body.text && req.body.updated) {
        db.insert({ text: req.body.text, updated: req.body.updated }, function(err, newDoc) {
          res.status(201).send(newDoc._id);
          eventEmitter.emit('update');
        });
      } else {
        res.status(400).send();
      }
    });

  router.route('/:id')

    // Get one todo by its id
    .get(function(req, res) {
      db.findOne({ _id: req.param('id') }, function(err, doc) {
        if (doc) res.json(doc);
        else res.status(404).end();
      });
    })

    // Update a todo
    .put(function(req, res) {
      if (req.body.text && req.body.updated) {
        db.findOne({ _id: req.param('id') }, function(err, doc) {
          if (doc && doc.updated === req.body.updated && doc.text === req.body.text) {
            res.status(204).end();
          } else if (!doc || doc.updated >= req.body.updated) {
            res.status(409).end();
          } else {
            db.update({ _id: req.param('id') }, { text: req.body.text, updated: req.body.updated }, {}, function() {
              res.status(204).end();
              eventEmitter.emit('update');
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
        db.findOne({ _id: req.param('id') }, function(err, doc) {
          if (doc && (doc.updated > req.body.updated || doc.text !== req.body.text)) {
            res.status(409).end();
          } else {
            db.remove({ _id: req.param('id') }, {}, function(err, removed) {
              res.status(202).end();
            });
            eventEmitter.emit('update');
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
