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

### POST /todos - create a new todo

- **text** - body of the todo

### POST /todos/:id - read a specific todo

### PUT /todos/:id - update a specific todo

- **text** - body of the todo

### DELETE /todos/:id - delete a todo
