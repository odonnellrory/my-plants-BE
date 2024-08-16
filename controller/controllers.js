const { usersModel } = require("../model/models");
const bcrypt = require("bcrypt");

const registerUser = (req, res, next) => {
  const { username, name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(hashedPassword);
  const newUser = new usersModel({
    username,
    name,
    email,
    password: hashedPassword,
  });

  newUser
    .save()
    .then((user) => {
      res.status(201).send("I am here");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("I am still there");
    });
};

module.exports = { registerUser };
