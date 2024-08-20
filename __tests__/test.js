const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const { seed } = require("../seed/seed");
const { usersModel, plantModel } = require("../model/models");

beforeAll(async () => {
  await mongoose.connect(
    "mongodb+srv://dbuser:admin001@plant-app.8jgjf.mongodb.net/plant-app"
  );
  await seed();
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("USERS", () => {
  test("POST: Returns 201 status code, can successfully register as a new user", () => {
    const newUser = {
      username: "PlantQueen",
      name: "Margaret",
      email: "margaretlovesplants@hotmail.com",
      password: "Margaret",
    };

    return request(app)
      .post("/api/register")
      .send(newUser)
      .expect(201)

      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "PlantQueen",
            name: "Margaret",
            email: "margaretlovesplants@hotmail.com",
            reward_points: expect.any(Number),
            password: expect.any(String),
            profile_picture: expect.any(String),
            plants: expect.any(Array),
            _id: expect.any(String),
            created_at: expect.any(String),
            __v: expect.any(Number),
          })
        );
      });
  });

  test("POST: Returns error message if email input is not a valid email.", () => {
    const newUser = {
      username: "PlantQueen",
      name: "Margaret",
      email: "margaretlovesplants&hotmail.com",
      password: "Margaret",
    };

    return request(app)
      .post("/api/register")
      .send(newUser)
      .then((response) => {
        expect(response.text).toBe("Incorrect email format");
      });
  });

  test("POST: Returns 409 status message when the registration information already exists.", () => {
    const newUser = {
      username: "PlantQueen",
      name: "Margaret",
      email: "margaretlovesplants@hotmail.co.uk",
      password: "Margaret",
    };

    return request(app)
      .post("/api/register")
      .send(newUser)
      .expect(409)
      .then(({ body }) => {
        expect(body.msg).toBe("Already exists!");
      });
  });

  test("POST: When user successfully creates a new account their password is secure and hashed.", () => {
    const newUser = {
      username: "PlantKing",
      name: "Marvin",
      email: "Marvinlovesplants@gmail.com",
      password: "Marvin",
    };

    return request(app)
      .post("/api/register")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user.password).toMatch(/^\$2[ayb]\$.{56}$/);
        expect(body.user.password).not.toBe("Marvin");
      });
  });

  test("POST: Returns 200 status code User can successfully login with their username and password, if they are an exisiting user.", () => {
    const loginInfo = {
      username: "PlantQueen",
      password: "Margaret",
    };

    return request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("PlantQueen");
      });
  });

  test("POST: 404 status code when user inputs a username that does not exist. ", () => {
    const loginInfo = {
      username: "PlantQueen2024",
      password: "Margaret",
    };

    return request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("username not found");
      });
  });

  test("POST: 401 status code when user inputs a username that does not exist. ", () => {
    const loginInfo = {
      username: "PlantQueen",
      password: "PlantQueenMaggie",
    };

    return request(app)
      .post("/api/login")
      .send(loginInfo)
      .expect(401)
      .then((response) => {
        expect(response.text).toBe("password incorrect, please try again!");
      });
  });

  test("GET: Returns 200 status code and users information when username is valid", () => {
    return request(app)
      .get("/api/users/greenThumb")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            username: "greenThumb",
            name: "Jane Smith",
            email: "janesmith@example.com",
            reward_points: expect.any(Number),
            password: expect.any(String),
            profile_picture: expect.any(String),
            plants: expect.any(Array),
            created_at: expect.any(String),
            __v: expect.any(Number),
            plant_count: expect.any(Number),
          })
        );
      });
  });

  test("GET: Returns 404 status code and users information when username is valid", () => {
    return request(app)
      .get("/api/users/greenThumbelina")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("username not found");
      });
  });
});

describe("PLANTS", () => {
  test("POST: Returns 200 status code. Users can successfully add a new plant to their account", () => {
    const newplant = {
      common_name: "Monstera",
      plant_origin: "Central America",
      scientific_name: ["Monstera deliciosa"],
      type: "Indoor",
      cycle: "Perennial",
      description: "Monstera is known for its large, glossy, split leaves.",
      sunlight: "Bright, indirect light",
      watering: "Water when the top inch of soil is dry",
      depth_of_water: "Moderate",
      last_watered: "2024-08-18",
      next_watering: "2024-08-25",
      watering_general_benchmark: { min: "Weekly", max: "Biweekly" },
      watering_period: "Weekly",
      volume_water_requirement: { min: "500ml", max: "1L" },
      pruning_month: ["March", "April"],
      pruning_count: { times_per_year: 2 },
      maintenance: "Low",
      growth_rate: "Moderate",
    };
    return request(app)
      .post("/api/users/gardenGuru/plants")
      .send(newplant)
      .expect(201)
      .then(({ body }) => {
        expect(body.plant).toEqual(
          expect.objectContaining({
            common_name: expect.any(String),
            plant_origin: expect.any(String),
            scientific_name: expect.any(Array),
            type: expect.any(String),
            cycle: expect.any(String),
            description: expect.any(String),
            sunlight: expect.any(String),
            watering: expect.any(String),
            depth_of_water: expect.any(String),
            last_watered: expect.any(String),
            next_watering: expect.any(String),
            watering_general_benchmark: expect.any(Object),
            watering_period: expect.any(String),
            volume_water_requirement: expect.any(Object),
            pruning_month: expect.any(Array),
            pruning_count: expect.any(Object),
            maintenance: expect.any(String),
            growth_rate: expect.any(String),
          })
        );
      });
  });
});

describe("PLANTS", () => {
  test("GET: Returns 200 status code with a list of plants by username.", () => {
    return request(app)
      .get("/api/users/plantLover1/plants")
      .expect(200)
      .then(({ body }) => {
        expect(body.plants.length).toBe(1);
        expect(body.plants[0]).toEqual(
          expect.objectContaining({
            common_name: expect.any(String),
            plant_origin: expect.any(String),
            scientific_name: expect.any(Array),
            type: expect.any(String),
            cycle: expect.any(String),
            description: expect.any(String),
            sunlight: expect.any(String),
            watering: expect.any(String),
            depth_of_water: expect.any(String),
            last_watered: expect.any(String),
            next_watering: expect.any(String),
            watering_general_benchmark: expect.any(Object),
            watering_period: expect.any(String),
            volume_water_requirement: expect.any(Object),
            pruning_month: expect.any(Array),
            pruning_count: expect.any(Object),
            maintenance: expect.any(String),
            growth_rate: expect.any(String),
          })
        );
      });
  });

  test("GET: Returns 404 status code when username is not not found.", () => {
    return request(app)
      .get("/api/users/plantLover2/plants")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("username not found");
      });
  });

  test("GET: Returns empty array and message if no plants are on the list", () => {
    return request(app)
      .get("/api/users/PlantKing/plants")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("No plants yet!");
      });
  });
});

describe("DELETE /api/users/:username/plants/:plant_id", () => {
  test("should delete a plant and verify it no longer exists", async () => {
    try {
      const user = await usersModel.findOne({ username: "plantLover1" });

      const plant = await plantModel.create({
        common_name: "Test Monstera",
        plant_origin: "Test Central America",
        scientific_name: ["Monstera deliciosa"],
        type: "Indoor",
        cycle: "Perennial",
        description: "Monstera is known for its large, glossy, split leaves.",
        sunlight: "Bright, indirect light",
        watering: "Water when the top inch of soil is dry",
      });

      user.plants.push(plant._id);
      await user.save();

      const response = await request(app)
        .delete(`/api/users/plantLover1/plants/${plant._id}`)
        .expect(200);

      expect(response.body.message).toBe("Plant Deleted Successfully");

      const updatedUser = await usersModel.findOne({ username: "plantLover1" });
      const deletedPlant = await plantModel.findById(plant._id);

      expect(updatedUser.plants).not.toContain(plant._id);
      expect(deletedPlant).toBeNull();
    } catch (error) {
      throw error; // Rethrow the error to fail the test if something goes wrong
    }
  });
});
