require("dotenv").load();
const pg = require('pg');
const connectionString = process.env.LOCAL_DATABASE_URL;
const client = new pg.Client(connectionString);

client
  .connect()
  .then(() => console.log('Connected to the database!'))
  .catch(err => console.error('Error connecting to the database', err.stack));

/* Insertion queries */
const insertToUsers = obj => {
  const query = {
    text: "INSERT INTO users (username, email, country, birthdate, lastlogin, isartist, ispremium, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    values: [obj.username, obj.email, obj.country, obj.birthdate, obj.lastlogin, obj.isartist, obj.ispremium, obj.image]
  };
  return new Promise((resolve, reject) => {
    client
      .query(query)
      .then(newUserProfile => resolve(newUserProfile))
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
}

/* Selection queries */
const selectUserByUserId = userId => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId]
  }
  return new Promise((resolve, reject) => {
    client
      .query(query)
      .then(results => results.rows.length ? resolve(results.rows[0]) : resolve(results.rows))
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
}

const selectUserByEmail = userEmail => {
  let query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [JSON.parse(userEmail)] // needed to not be a string since PostgreSQL is preferential to single-quotes and passing the email in would have resulted in double-quotes
  };
  return new Promise((resolve, reject) => {
    client
      .query(query)
      .then(results => (results.rows.length ? resolve(results.rows[0]) : resolve(results.rows)))
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
};

const selectActiveUsersByDates = (startUnix, endUnix) => {
  console.time(`search for users active between ${startUnix} and ${endUnix}`);
  let query = {
    text: "SELECT * FROM users WHERE lastlogin BETWEEN $1 AND $2",
    values: [startUnix, endUnix]
  };
  return new Promise((resolve, reject) => {
    client
      .query(query)
      .then(results => {
        if (results.rows.length) {
          console.timeEnd(`search for users active between ${startUnix} and ${endUnix}`);
          resolve(results.rows);
        } else {
          console.timeEnd(`search for users active between ${startUnix} and ${endUnix}`);
          resolve(results.rows);
        }
      })
      .catch(err => {
        console.timeEnd(`search for users active between ${startUnix} and ${endUnix}`);
        console.error(err.stack);
        reject(err);
      });
  });
};




module.exports = {
  client,
  insertToUsers,
  selectUserByUserId,
  selectUserByEmail,
  selectActiveUsersByDates
};