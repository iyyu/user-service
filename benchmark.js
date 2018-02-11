const siege = require("siege");

// FOR STRESS TESTING specific endpoints

siege()
  .wait(2000)
  .on(3000)
  // .get("/users/active/Nov292017/Jan312018")
  // .for(100000)
  .get("/users/profile/10000004")
  .for(100000)
  .times.attack();
  
