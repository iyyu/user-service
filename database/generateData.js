const fs = require('fs');
const path = require('path');
const faker = require('faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/* helper functions that generate or clean data */
const birthdateMin = -1041379200; // 'January 1, 1937'
const birthdateMax = 1043971200; // 'January 31, 2003'
const loginMin = 1509494400; // 'November 1, 2017'
const loginMax = 1517356800; // 'January 31, 2018'

const getRange = (minUnix, maxUnix) => {
  return Math.floor(Math.random() * (maxUnix - minUnix + 1)) + minUnix;
}
const cleanCountry = str => str.includes(',') ? 'USA' : str;

const createData = async () => {
  const fileCount = 20;
  for (let i = fileCount; i >= 0; i--) {
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, `/${fileCount}.csv`),
      header: ['country', 'birthdate', 'lastlogin', 'isartist', 'ispremium', 'image']
    });
    let users = [];
    for (let j = 0; j <= 500000; j++) {
      let fakeUser = {
        // username: fileCount + faker.internet.userName() + j,
        // email: faker.internet.userName() + j + fileCount + '@gmail.com',
        country: ((Math.round(Math.random()) === 0) ? 'USA' : cleanCountry(faker.address.country())),
        birthdate: getRange(birthdateMin, birthdateMax),
        lastlogin: getRange(loginMin, loginMax),
        isartist: ((Math.round(Math.random()) === 0) ? true : false),
        ispremium: ((Math.round(Math.random()) === 0) ? true : false),
        image: faker.image.avatar()
      }
      users[j] = fakeUser;
    }
    await csvWriter.writeRecords(users)
    .then(() => console.log(`DONE WITH WRITING TO CSV ${i}`));
  }
}

try {
  console.time("generation");
  createData()
  .then(() => {
    console.timeEnd("generation");
  });
} catch (err) {
  console.error(err);
}