# offline-todo-api [![Build Status](https://travis-ci.org/matthew-andrews/offline-todo-api.svg?branch=master)](https://travis-ci.org/matthew-andrews/offline-todo-api)

Simple (hopefully) RESTful API that allows you to create, read, update and delete items from your todo list.

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
curl http://localhost:3000/todos
```

### GET /todos/:id - read a specific todo

```
curl http://localhost:3000/todos/MKdbGQHyQl4djUNv
```

### POST /todos - create a new todo

```
curl http://localhost:3000/todos -X POST -d '{"text":"Do the dishes"}' -H "Content-Type: application/json"
```

#### Input

Name | Type      | Description
---- | --------- | -------------------------------
text | string    | **Required.** The todo text
text | timestamp | **Required.** Last updated time

### PUT /todos/:id - update a specific todo

```
curl http://localhost:3000/todos/MKdbGQHyQl4djUNv -X POST -d '{"text":"Do the dishes and walk the dog"}' -H "Content-Type: application/json"
```

#### Input

Name | Type      | Description
---- | --------- | -------------------------------
text | string    | The todo text
text | timestamp | **Required.** Last updated time

### DELETE /todos/:id - delete a todo

```
curl http://localhost:3000/todos/MKdbGQHyQl4djUNv -X DELETE
```
