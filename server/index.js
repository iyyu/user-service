require("dotenv").load();
require("newrelic");
const db = require('./../database/index.js');
const express = require('express');
const app = express();
const toDate = require('normalize-date');
const timestamp = require('unix-timestamp');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (req, res) => res.status(200).end());

app.get('/users/profile/:userId', (req, res) => {
  db
    .selectUserByUserId(req.params.userId)
    .then(userProfile => res.send(userProfile))
    .catch(err => res.status(404).send(`Error getting user profile for ${req.params.userId} from the database`));
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
      .then(activeUsers => console.log('activeUsers', activeUsers));
  }
});

app.post('/users/profile', (req, res) => {
  db
    .insertToUsers(req.body)
    .then(newUserProfile => res.send(newUserProfile))
    .catch(err => res.status(404).send('Error inserting into database'));
});

app.listen(PORT, () => {
  console.log(`Ready on ${PORT}`);
});