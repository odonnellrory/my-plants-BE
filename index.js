const express = require("express");

const app = express();

const { registerUser } = require("./controller/controllers.js");

app.use(express.json());

app.post("/api/register", registerUser);

app.post("/api/login", async (req, res) => {
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

    res.status(200).send(`Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
});

app.post("/api/users/:user_id/plants", (req, res) => {
  const { user_id } = req.params;

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
      return usersModel.findById(user_id).then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Sorry!" });
        }

        user.plants.push(plant._id);
        user.plant_count = user.plants.length;

        return user.save().then(() => {
          res.status(200).send({ plant });
        });
      });
    })
    .catch((error) => {
      console.log(error);

      res.status(400).send(error);
    });
});

app.listen(9000, () => {
  console.log("Listening on port 9000!!!!");
});
