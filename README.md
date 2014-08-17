# offline-todo-api [![Build Status](https://travis-ci.org/matthew-andrews/offline-todo-api.svg?branch=master)](https://travis-ci.org/matthew-andrews/offline-todo-api)

Simple (hopefully) RESTful API that allows you to create, read, update and delete items from your todo list.

## Conflict resolution strategy

Any update (PUT) or delete (DELETE) requests must provide a `updated` timestamp and the value of `text`.  If the provided timestamp is older than the `updated` timestamp stored on the server the PUT or DELETE will be rejected.

Where there is a draw (ie. the `updated` timestamps are equal) the server will look at the value of `text` - if the server's and the request's values match the PUT or DELETE will be accepted.  If they do not match, the PUT or DELETE will be rejected.

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

### GET /todos/:created - read a specific todo

```
curl https://offline-todo-api.herokuapp.com/todos/1408228141678
```

### POST /todos - create a new todo

```
curl https://offline-todo-api.herokuapp.com/todos -X POST -d '{"text":"Do the dishes","updated":1408182141845}' -H "Content-Type: application/json"
```

#### Input

Name    | Type      | Description
------- | --------- | ----------------------------------------
text    | string    | **Required**. The todo text
created | timestamp | **Required**. Created time, used as uuid
updated | timestamp | **Required**. Last updated time

### PUT /todos/:created - create or update a specific todo

```
curl https://offline-todo-api.herokuapp.com/todos/1408228141678 -X POST -d '{"text":"Do the dishes and walk the dog","updated":1408182141855}' -H "Content-Type: application/json"
```

#### Input

Name    | Type      | Description
------- | --------- | -------------------------------
text    | string    | **Required**. The todo text
updated | timestamp | **Required**. Last updated time

### DELETE /todos/:created - delete a todo

```
curl https://offline-todo-api.herokuapp.com/todos/1408228141678 -X DELETE
```

#### Input

Name    | Type      | Description
------- | --------- | -------------------------------
text    | string    | **Required**. The todo text
updated | timestamp | **Required**. Last updated time

Note: once an item has been deleted a todo with the same `created` timestamp cannot be recreated.
