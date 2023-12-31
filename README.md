[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

  Fast, unopinionated, minimalist web framework for [Node.js](http://nodejs.org).
  
## Description
```bash
$ TECHNICAL TEST NODEJS ADITYA
```

## Installation

```bash
$ npm install
```
or

```bash
$ yarn install
```

## Running the app

```bash
$ yarn start
```
or
```bash
$ npm start
```

## How to Start

```bash
1. Git Clone https://github.com/Adityapfm99/management-task.git
2. Install Mongo DB in local / Register in cloud Mongo DB
3. Rename file env_sample to .env
4. Replace value MONGODB_URI to your connection string

```
## Unit testing

To run the test suite, first install the dependencies, then run :

```bash
$ npm test
```
or
```bash
$ yarn test
```
![Alt text](img/unit-test.png)

## API Documentation Swagger
```bash
$ http://localhost:3000/docs
```

![Alt text](img/docs-swagger.png)


# Endpoint  GET
```
Request: 
Base_url = /api/v1

url : [ GET] {Base_url}/tasks

Response:
[
    {
        "_id": "650d53f412d38f32613838a6",
        "title": "Updated Title1",
        "description": "conba uda",
        "completed": false,
    },
    {
        "_id": "650dd655b0f8c919f51ea7f9",
        "title": "test1 code",
        "description": "this one is technical test123",
        "completed": false,
    }
]
```
# Endpoint POST
```
Request: 
Base_url = /api/v1

url : [Get] {Base_url}/tasks
payload : {
    "title": "create code",
    "description": "this one is technical test description",
    "completed": false
}


Response:
{
    "status": "ok",
    "message": "Task created succesfully",
    "id": "650dd655b0f8c919f51ea7f9"
}
```
# Endpoint GET BY ID
```
Request: 
Base_url = /api/v1

url : [Get] {Base_url}/tasks/650da8b0dadb0d0afab78c1e

Response:
{
    "_id": "650da8b0dadb0d0afab78c1e",
    "title": "coba",
    "description": "this one is technical test123",
    "completed": true,
    "__v": 0
}
```

# Endpoint UPDATE BY ID
```
Request: 
Base_url = /api/v1

url : [PATCH] {Base_url}/tasks/650da8b0dadb0d0afab78c1e

payload : {
    "title": "update",
    "description": "this one is technical test",
    "completed": true
}

Response:
{
    "_id": "650da8b0dadb0d0afab78c1e",
    "title": "update",
    "description": "this one is technical test",
    "completed": true,
    "__v": 0
}
```
# Endpoint DELETE BY ID
```
Request: 
Base_url = /api/v1

url : [DELETE] {Base_url}/tasks/650da8b0dadb0d0afab78c1e

Response:
{
    "status": "ok",
    "message": "Task has been deleted"
}
