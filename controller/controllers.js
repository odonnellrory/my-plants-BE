const { usersModel, plantModel } = require("../model/models");
const bcrypt = require("bcrypt");

const registerUser = (req, res, next) => {
  const { username, name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new usersModel({
    username,
    name,
    email,
    password: hashedPassword,
  });

  newUser
    .save()
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await usersModel.findOne({ username });

    if (!user) {
      return res.status(404).send("username not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send("password incorrect, please try again!");
    }

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

const addPlant = (req, res, next) => {
  const { username } = req.params;

  const {
    plant_name,
    plant_origin,
    plant_type,
    plant_cycle,
    plant_description,
    sunlight,
    water,
  } = req.body;

  const newPlant = new plantModel({
    plant_name,
    plant_origin,
    plant_type,
    plant_cycle,
    plant_description,
    sunlight,
    water,
  });

  newPlant
    .save()
    .then((plant) => {
      return usersModel.findOne({ username }).then((user) => {
        if (!user) {
          return res.status(404).send({ message: "username not found!" });
        }

        user.plants.push(plant._id);
        user.plant_count = user.plants.length;

        return user.save().then(() => {
          res.status(200).send({ plant });
        });
      });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { registerUser, loginUser, addPlant };
