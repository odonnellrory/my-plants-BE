const bcrypt = require('bcrypt');

const usersData = 

{ users: [
      {
        username: 'plantLover1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: bcrypt.hashSync('password123', 10),
        reward_points: 50,
      },
      {
        username: 'greenThumb',
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        password: bcrypt.hashSync('greenlife', 10),
        reward_points: 80,
      },
      {
        username: 'botanicalBoss',
        name: 'Alice Johnson',
        email: 'alicejohnson@example.com',
        password: bcrypt.hashSync('botanica123', 10),
        reward_points: 120,
      },
      {
        username: 'flowerFanatic',
        name: 'Bob Brown',
        email: 'bobbrown@example.com',
        password: bcrypt.hashSync('flowerpower', 10),
        reward_points: 30,
      },
      {
        username: 'natureNurturer',
        name: 'Clara Green',
        email: 'claragreen@example.com',
        password: bcrypt.hashSync('nature123', 10),
        reward_points: 60,
      },
      {
        username: 'leafLover',
        name: 'David Leaf',
        email: 'davidleaf@example.com',
        password: bcrypt.hashSync('leafy123', 10),
        reward_points: 45,
      },
      {
        username: 'gardenGuru',
        name: 'Ella Flowers',
        email: 'ellaflowers@example.com',
        password: bcrypt.hashSync('gardenlove', 10),
        reward_points: 90,
      },
    ]
};

    module.exports = usersData;

  