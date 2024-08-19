const mongoose = require('../db/collections'); 
const { usersModel, plantModel } = require('../model/models'); 
const plantsData = require('./plantData');
const usersData = require('./userData');


const seed = async () => {

  await mongoose.connection.dropDatabase();

  const users = await usersModel.insertMany(usersData.users);
  const plants = await plantModel.insertMany(plantsData.plants);

  for (let i = 0; i < users.length; i++) {

    users[i].plants.push(plants[i]._id);
    users[i].plant_count = 1; 
    await users[i].save();
  }
  console.log('Test database seeded successfully.');

  return { users, plants };

};

seed()

module.exports = { seed };





















