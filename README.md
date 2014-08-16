# offline-todo-api [![Build Status](https://travis-ci.org/matthew-andrews/offline-todo-api.svg?branch=master)](https://travis-ci.org/matthew-andrews/offline-todo-api)

Simple (hopefully) RESTful API that allows you to create, read, update and delete items from your todo list.

## Conflict resolution strategy

Any update (PUT) or delete (DELETE) requests must provide a `timestamp` and the value of `text`.  If the provided timestamp is older than the `timestamp` stored on the server the PUT or DELETE will be rejected.

Where there is a draw (ie. the `timestamp`s are equal) the server will look at the value of `text` - if the server's and the request's values match the PUT or DELETE will be accepted.  If they do not match, the PUT or DELETE will be rejected.

## Install and run

```
git clone git@github.com:matthew-andrews/offline-todo-api.git
cd offline-todo-api
npm install
node index.js
```

## Documentation

### GET /todos - list all todos

```
curl https://offline-todo-api.herokuapp.com/todos
```

### GET /todos/:id - read a specific todo

```
curl https://offline-todo-api.herokuapp.com/todos/MKdbGQHyQl4djUNv
```

### POST /todos - create a new todo

```
curl https://offline-todo-api.herokuapp.com/todos -X POST -d '{"text":"Do the dishes","updated":1408182141845}' -H "Content-Type: application/json"
```

#### Input

Name    | Type      | Description
------- | --------- | -------------------------------
text    | string    | **Required**. The todo text
updated | timestamp | **Required**. Last updated time

### PUT /todos/:id - update a specific todo

```
curl https://offline-todo-api.herokuapp.com/todos/MKdbGQHyQl4djUNv -X POST -d '{"text":"Do the dishes and walk the dog","updated":1408182141855}' -H "Content-Type: application/json"
```

#### Input

Name    | Type      | Description
------- | --------- | -------------------------------
text    | string    | **Required**. The todo text
updated | timestamp | **Required**. Last updated time

### DELETE /todos/:id - delete a todo

```
curl https://offline-todo-api.herokuapp.com/todos/MKdbGQHyQl4djUNv -X DELETE
```

#### Input

Name    | Type      | Description
------- | --------- | -------------------------------
text    | string    | **Required**. The todo text
updated | timestamp | **Required**. Last updated time
