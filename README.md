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
curl http://localhost:3000/todos -X POST -d "{ text: 'Wash the dishes' }"
```

#### Input

Name | Type   | Description
---- | ------ | ---------------------------
text | string | **Required.** The todo text

### PUT /todos/:id - update a specific todo

```
curl http://localhost:3000/todos/MKdbGQHyQl4djUNv -X PUT -d "{ _id: 'MKdbGQHyQl4djUNv', text: 'Wash the dishes and walk the dog' }"
```

#### Input

Name | Type   | Description
---- | ------ | ------------------------------------------
_id  | string | **Required.** The id of the todo to update
text | string | The todo text

### DELETE /todos/:id - delete a todo

```
curl http://localhost:3000/todos/MKdbGQHyQl4djUNv -X DELETE
```
