require("dotenv").load();
const pg = require('pg');

const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);

client
.connect()
.then(() => console.log('Connected to the database!'))
.catch(err => console.error('Error connecting to the database', err.stack));


/* Insertion queries */
const insertToUsers = obj => {
  let image = obj.image || 'https://www.poynter.org/sites/default/files/wp-content/uploads/2012/09/default_profile_2_reasonably_small.png';
  const query = { 
    text: "INSERT INTO users (username, email, country, birthdate, lastlogin, isartist, ispremium, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
    values: [obj.username, obj.email, obj.country, obj.birthdate, obj.lastlogin, obj.isartist, obj.ispremium, image]
  };
  return new Promise ((resolve, reject) => {
    console.time(`insertion of ${obj.username}`);
    client.query(query)
    .then(newUserProfile => {
      console.timeEnd(`insertion of ${obj.username}`);
      resolve(newUserProfile);
    })
    .catch(err => {
      console.error(err.stack);
      reject(err);
    });
  });
}

/* Selection queries */
const selectUserByUserId = userId => {
  console.time(`search for ${userId}`);
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId]
  }
  return new Promise((resolve, reject) => {
    client.query(query)
    .then(results => {
      if (results.rows.length) {
        console.timeEnd(`search for ${userId}`);
        resolve(results.rows[0]);
      } else {
        reject(results);
      }
    })
    .catch(err => {
      console.error(err.stack);
      reject(err);
    });
  });
}

module.exports = {
  insertToUsers,
  selectUserByUserId
}

