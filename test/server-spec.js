const request = require('supertest');
const agent = request.agent('http://localhost:3000');
const server = require("../server/server-index.js");

describe('Basic server functionality', function () {
  it('should return a status 200', function (done) {
    server
      .get('/');
    agent
      .expect(200, done());
  });
  it("should return a status 404 if route does not exist", function (done) {
    server
      .get("/random");
    agent
      .expect(404, done());
  });
});

describe("server route: /users/profile", function() {
  it("should not create a user profile when the email already exists in the database", function (done) {
    agent
      .post(`/users/profile/`)
      .send({
        username: "iyutest2",
        email: "iyutest2@gmail.com",
        country: "USA",
        isartist: false,
        ispremium: true,
        lastlogin: 1518302326,
        birthdate: 1518302326
      })
      .expect(function (results) {
        results.text = 'Error inserting into database';
      }, done())
  });
});

describe('server route: /users/profile/:userId', function () {
  it('should return a user profile entry from the database if it exists', function (done) {
    let randomInt = Math.floor(Math.random() * (10000000 - 1 + 1)) + 1;
    agent
      .get(`/users/profile/${randomInt}`)
      .expect(function (result) {
        res.body.id = randomInt
      })
      .expect(200, done());
  });

  it('should return a 404 error if the user profile does not exist', function (done) {
    agent
      .get('/users/profile/0')
      .expect(404, done());
  })
});
