require("dotenv").config();
const pool = require("./db-pooling.js");

/* Insertion queries */
const insertToUsers = profile => {
  let values = { username, email, country, birthdate, lastlogin, isartist, ispremium, image } = profile;
  values.image = values.image || process.env.DEFAULT_PROFILE_IMAGE;
  const query = {
    text: "INSERT INTO users (username, email, country, birthdate, lastlogin, isartist, ispremium, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    values: values
  };
  pool.connect((err, client, release) => {
    if (err) {
      return console.error("Error acquiring client", err.stack);
    }
    client.query(query, (err, result) => {
      release();
      return err ? console.error("Error executing query", err.stack) : result;
    });
  });
};

/* Selection queries */
const selectUserByUserId = userId => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [userId]
  };
  return new Promise((resolve, reject) => {
    pool
      .query(query)
      .then(results => resolve(results.rows[0]))
      .catch(err => {
        console.log(err.stack);
        reject(err);
      });
  });
}

const selectUserByEmail = userEmail => {
  let query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [JSON.parse(userEmail)] 
    // PostgreSQL is preferential to single-quotes and passing the email in would have resulted in double-quotes, so this needs to be a non-string
  };
  return new Promise((resolve, reject) => {
    pool
      .query(query)
      .then(results => results.rows.length ? resolve(results.rows[0]) : resolve(results.rows))
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
};

const selectActiveUsersByDates = (startUnix, endUnix) => {
  console.time(`search for users active between ${startUnix} and ${endUnix}`);
  const query = {
    text: "SELECT * FROM users WHERE lastlogin BETWEEN $1 AND $2",
    values: [startUnix, endUnix]
  };
  return new Promise((resolve, reject) => {
    pool
      .query(query)
      .then(results => {
        console.timeEnd(`search for users active between ${startUnix} and ${endUnix}`);
        resolve(results.rows);
      })
      .catch(err => {
        console.timeEnd(`search for users active between ${startUnix} and ${endUnix}`);
        console.error(err.stack);
        reject(err);
      });
  });
};

module.exports = {
  insertToUsers,
  selectUserByUserId,
  selectUserByEmail,
  selectActiveUsersByDates
};