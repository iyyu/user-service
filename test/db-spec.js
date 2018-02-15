require("dotenv").load();
const request = require("supertest");
const expect = require('chai').expect;
const db = require('../database/db-pooling-queries.js');
const pool = require ('../database/db-pooling.js');

const testTable = 'users_testing';

describe("hooks", function () {
  before(function () {
    pool.query(`CREATE TABLE IF EXISTS ${testTable} AS SELECT * FROM users LIMIT 5000`);
  });
  
  after(function () {
    pool.query(`DROP TABLE ${testTable}`);
    pool.end();
  });
  
})

describe('Basic database functionality', function () {
  it("should connect to the database", function (done) {
    pool.connect(function (err) {
      expect(err).to.not.be.an("error");
      done();
    });
  });
  it("should return a user profile if it exists", function (done) {
    pool.query("SELECT * from users_testing LIMIT 1")
    .then(function (results) {
      expect(results.rows).to.be.an("array");
      expect(results.rows).to.be.an("array").that.is.not.empty;
      done();
    });
  });
  it("should return a user profile with the correct properties", function (done) {
    pool.query("SELECT * from users_testing LIMIT 1")
    .then(function (results) {
      expect(results.rows[0]).to.have.property("id");
      expect(results.rows[0]).to.have.property("username");
      expect(results.rows[0]).to.have.property("email");
      expect(results.rows[0]).to.have.property("country");
      expect(results.rows[0]).to.have.property("birthdate");
      expect(results.rows[0]).to.have.property("lastlogin");
      expect(results.rows[0]).to.have.property("isartist");
      expect(results.rows[0]).to.have.property("ispremium");
      expect(results.rows[0]).to.have.property("image");
      done();
    });
  });
});
