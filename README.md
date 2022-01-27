<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  

  <h1 align="center">Trivia games API</h3>

  <p align="center">
    Create quizzes and have fun!
    <br />
</div>

<!-- ABOUT THE PROJECT -->
## About The Project


This API lets you simply create quizzes with questions and answers. The project is written in pure `Javascript` and based on `Node.js`.
The project architecture is guided by Fastify, taking advantage of its plugin architecture (https://www.fastify.io/docs/latest/)


### Built With
* Fastify
* Prisma

The project has a main folder called `lib` which contains the 2 main plugins: `quiz` and `user`
The `quiz` plugin has all the logic required to create, edit, read and delete quizzes. While the plugin `user` has all the logic to create, edit and delete users.
The `plugins` folder contains all the common plugins shared across the code by quiz and user. The `prisma` folder contains the schema model of the database and the migrations needed to create the tables and a first user ready to use.
Fastify

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* `node 14.18.3` https://nodejs.org/download/release/latest-v14.x/
* `yarn or npm` https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable
* `docker-compose` https://docs.docker.com/compose/install/


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/fabrilallo/trivia-games.git
   ```
2. Install dependencies
   ```sh
   yarn
   ```
 3. Create inside the `lib/prisma` folder a file `.env` with the following variable:
   ```sh
   DATABASE_URL=postgresql://admin:password@localhost:5432/mydb?schema=public
   ```
   
 4. Create inside the root folder a file `.env` with the following variable:
   ```sh
  JWT_SECRET=mysupersecret
   ```
5. Run docker-compose to start the PostgreSQL database
   ```sh
   docker-compose up -d
   ```
5. Run the migration script to create the tables and a first user
   ```sh
   yarn prisma:migrate
   ```
7. Start the server on the port 3000
   ```sh
   yarn start
   ```
   
Now you're ready to use the Trivia games API.

Or maybe you run some tests? Then simply run:
   ```sh
   yarn test
   ```
   
<!-- USAGE EXAMPLES -->
## Usage

In order to use the API you first need to login calling the **POST**`/login` route, with the following body:

   ```json
   {
    "email": "admin@example.com",
    "password": "password1234"
    }
   ```
Then you will get a response like this:
   ```json
{
    "statusCode": 200,
    "message": "You are authenticated",
    "data": {
        "email": "admin@example.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjQzMjQyMTk2LCJleHAiOjE2NDM1MDEzOTZ9.O_3OfJsbYXA9Acx8IEGkdN1dFTjtiZ4KdYnKkpRc3pM",
        "createdAt": "2022-01-27T00:05:23.354Z",
        "updatedAt": "2022-01-27T00:09:56.861Z"
    }
}
   ```
   
Now you can call any API using the `token` provided by the login. You need to put the `token` in the `Authorization` `header` with the following format: <br />
 
`Bearer token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjQzMjQyMTk2LCJleHAiOjE2NDM1MDEzOTZ9.O_3OfJsbYXA9Acx8IEGkdN1dFTjtiZ4KdYnKkpRc3pM`
# API

## Quiz

### Create a quiz
`POST /quizzes` with the following body: 
```json
{
      "name": "Guess my name",
      "questions": [
        {
          "name": "What's your name?",
          "answers": [
            {
              "name": "Fabrizio",
              "isCorrect": true
            },
            {

              "name": "Giovanni",
              "isCorrect": false
            },
            {

              "name": "Marco",
              "isCorrect": false
            },
            {

              "name": "Luca",
              "isCorrect": false
            }
          ]
        }
      ]
    }
   ```
### Update a quiz
`PUT /quizzes/:id` with the following body:
```json
{
      "name": "Guess my name",
      "questions": [
        {
          "name": "What's your name?",
          "answers": [
            {
              "name": "Fabrizio",
              "isCorrect": true
            },
            {

              "name": "Giovanni",
              "isCorrect": false
            },
            {

              "name": "Marco",
              "isCorrect": false
            },
            {

              "name": "Luca",
              "isCorrect": false
            }
          ]
        }
      ]
    }
   ```
### Delete a quiz
`DELETE /quizzes/:id` </ br>

### Get quizzes
`GET /quizzes` </ br>

## User

### Create a user
`POST /users` with the following body: 
```json
{
    "email": "fabrizio.lallo@gmail.com",
    "password": "password1234"
}
   ```
### Update a user
`PUT /users/:id` with the following body: 
```json
{
    "email": "fabrizio.lallo95@gmail.com",
    "password": "password1234"
}
   ```
### Delete a user
`DELETE /users/:id` </ br>

## Auth
### Login
`POST /login` with the following body:
```json
{
    "email": "fabrizio.lallo@gmail.com",
    "password": "password1234"
}

```

<!-- ROADMAP -->
## Roadmap

- [ ] Add Changelog
- [ ] Improve security implementing authentication based on OAuth2  protocol
- [ ] Improve test coverage
- [ ] Improve API documentation
- [ ] Implement specific endpoints for questions and answers


<p align="right">(<a href="#top">back to top</a>)</p>

