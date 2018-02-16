require("dotenv").load();
require("newrelic");
const db = require('./../database/db-pooling-queries.js');
const express = require('express');
const app = express();
const toDate = require('normalize-date');
const timestamp = require('unix-timestamp');
const bodyParser = require('body-parser');
const PORT = 4000 || process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).end());

app.get('/users/profile/id/:userId', (req, res) => {
  db
    .selectUserByUserId(req.params.userId)
    .then(userProfile => res.send(userProfile))
    .catch(err => res.status(404).send(`Error getting user profile for ${req.params.userId} from the database`));
});

app.get('/users/profile/email/:userEmail', (req, res) => {
  db
    .selectUserByEmail(JSON.stringify(req.params.userEmail))
    .then(userProfile => res.send(userProfile))
    .catch(err => res.status(404).send(`Error getting user profile for ${req.params.userEmail} from the database`));
});

app.get('/users/active/:startDate/:endDate', (req, res) => {
  // convert the startDate and endDate to Javascript Date time, and then UNIX time
  let startDate = timestamp.fromDate(toDate(req.params.startDate));
  let endDate = timestamp.fromDate(toDate(req.params.endDate));

  if (JSON.stringify(startDate) === 'null' || JSON.stringify(endDate) === 'null') {
    res.send(`Error parsing dates for ${req.params.startDate} and ${req.params.endDate}`);
  } else {
    db
      .selectActiveUsersByDates(startDate, endDate)
      .then(activeUsers => res.send(activeUsers));
  }
});

app.post('/users/profile', (req, res) => {
  db
    .insertToUsers(req.body)
    .then(newUserProfile => res.send(newUserProfile))
    .catch(err => res.status(404).send('Error inserting new user into database'));
});

app.listen(PORT, () => console.log(`Ready on ${PORT}`));

module.exports = app;