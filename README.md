# offline-todo-api [![Build Status](https://travis-ci.org/matthew-andrews/offline-todo-api.svg?branch=master)](https://travis-ci.org/matthew-andrews/offline-todo-api)

Simple (hopefully) RESTful API that allows you to create, read, ~~update~~ and delete items from your todo list.

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
curl https://offline-todo-api.herokuapp.com/todos/1408228141678
```

### POST /todos - create a new todo

```
curl https://offline-todo-api.herokuapp.com/todos -X POST -d '{"text":"Do the dishes"}' -H "Content-Type: application/json"
```

#### Input

Name    | Type      | Description
------- | --------- | ------------------------------------
text    | string    | **Required**. The todo text
id      | mixed     | **Required**. Some unique identifier

### PUT /todos/:id - create or update a specific todo

```
curl https://offline-todo-api.herokuapp.com/todos/1408228141678 -X POST -d '{"text":"Do the dishes and walk the dog"}' -H "Content-Type: application/json"
```

#### Input

Name    | Type      | Description
------- | --------- | -------------------------------
text    | string    | **Required**. The todo text

Note: actually updating the text of an existing todo is currently not supported.

### DELETE /todos/:id - delete a todo

```
curl https://offline-todo-api.herokuapp.com/todos/1408228141678 -X DELETE
```

Note: once an item has been deleted a todo its `id` cannot be reused.
