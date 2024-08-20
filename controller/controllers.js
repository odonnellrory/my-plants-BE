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
      if (err.code === 11000) {
        // Duplicate key error
        res.status(409).send({ msg: "Already exists!" });
      } else {
        next(err);
      }
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
    nickname,
    common_name,
    plant_origin,
    scientific_name,
    type,
    cycle,
    description,
    sunlight,
    watering,
    date_added,
    depth_of_water,
    last_watered,
    next_watering,
    watering_general_benchmark,
    watering_period,
    volume_water_requirement,
    pruning_month,
    pruning_count,
    maintenance,
    growth_rate,
  } = req.body;

  const newPlant = new plantModel({
    nickname,
    common_name,
    plant_origin,
    scientific_name,
    type,
    cycle,
    description,
    sunlight,
    watering,
    date_added,
    depth_of_water,
    last_watered,
    next_watering,
    watering_general_benchmark,
    watering_period,
    volume_water_requirement,
    pruning_month,
    pruning_count,
    maintenance,
    growth_rate,
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
          res.status(201).send({ plant });
        });
      });
    })
    .catch((error) => {
      next(error);
    });
};

const getPlants = (req, res, next) => {
  const { username } = req.params;

  usersModel
    .findOne({ username })
    .populate("plants")
    .then((user) => {
      if (!user) {
        return res.status(404).send("username not found");
      }

      if (user.plants.length === 0) {
        return res.status(200).send("No plants yet!");
      }

      res.status(200).send({ plants: user.plants });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  const { username } = req.params;

  usersModel
    .findOne({ username })
    .lean()
    .then((user) => {
      if (!user) {
        return res.status(404).send("username not found");
      }

      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
const deletePlant = (req, res, next) => {
  const { username, plantId } = req.params;

  usersModel
    .findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      const plantIndex = user.plants.indexOf(plantId);
      if (plantIndex === -1) {
        return res.status(404).send("Plant not found in user's collection");
      }

      user.plants.splice(plantIndex, 1);
      user.plant_count = user.plants.length;

      return user
        .save()
        .then(() => plantModel.findByIdAndDelete(plantId))
        .then(() => {
          res.status(200).send({ message: "Plant deleted successfully" });
        });
    })
    .catch((error) => {
      next(error);
    });
};

const updatePlantNickname = (req, res, next) => {
  const { username, plantId } = req.params;
  const { nickname } = req.body;

  usersModel
    .findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      return plantModel.findByIdAndUpdate(
        plantId,
        { nickname: nickname },
        { new: true }
      );
    })
    .then((plant) => {
      if (!plant) {
        return res.status(404).send("Plant not found");
      }
      res.status(200).send("Plant updated successfully");
    })
    .catch(next);
};

const updateUsername = (req, res, next) => {
  const { currentUsername } = req.params;
  const { newUsername } = req.body;

  // Check if the new username already exists
  usersModel
    .findOne({ username: newUsername })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({ message: "Username already exists" });
      }

      // Find and update the user
      return usersModel.findOneAndUpdate(
        { username: currentUsername },
        { username: newUsername },
        { new: true }
      );
    })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
      }
      res
        .status(200)
        .send({ message: "Username updated successfully", user: updatedUser });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  registerUser,
  loginUser,
  addPlant,
  getPlants,
  getUserInfo,
  deletePlant,
  updatePlantNickname,
  updateUsername,
};
