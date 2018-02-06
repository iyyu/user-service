const express = require('express');
const app = express();
const db = require('./../database/index.js');

let PORT = 3000;

app.get('/users/profile/:userId', (req, res) => {
  db.selectUserByUserId(req.params.userId)
  .then(data => res.send(data));
})

app.post('/users/createprofile', (req, res) => {
  db.insertToUsers(req.query)
  .then(data => console.log(data));
})

app.listen(PORT, () => {
  console.log(`Ready on ${PORT}`);
  });