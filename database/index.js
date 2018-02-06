const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'psql://MacbookPro:@localhost/capstone';

const client = new pg.Client(connectionString);

client.connect()
.then(() => console.log('Connected to the database!'))
.catch(err => console.error('Error connecting to the database', err.stack));


// insertion queries
const insertToUsers = (values) => {
  const query = {
    text: 'INSERT INTO users (username, email, country, birthdate, lastLogin, type, product) values ($1, $2, $3, $4, $5, $6, $7)',
    values: [values]
  }
  return new Promise ((resolve, reject) => {
    console.time('insertion');
    client.query(query)
    .then(res => {
      console.timeEnd('insertion');
      resolve(res);
    })
    .catch(e => console.error(e.stack));
  });
}
    


// selection queries
const selectUserByUserId = (userId) => {
  console.time(`search for ${userId}`);
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId]
  }
  return new Promise((resolve, reject) => {
    client.query(query)
    .then(res => {
      console.timeEnd(`search for ${userId}`);
      resolve(res.rows[0]);
    })
    .catch(e => console.error(e.stack));
  });
}


module.exports = {
  insertToUsers,
  selectUserByUserId
}

