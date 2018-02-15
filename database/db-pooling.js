require("dotenv").load();
const pg = require('pg');
const { Pool } = require("pg");
const connectionString = process.env.LOCAL_DATABASE_URL;
const pool = new Pool({connectionString});

module.exports = pool;