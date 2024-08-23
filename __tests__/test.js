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
  test("POST: Returns 201 status code. Users can successfully add a new plant to their account", () => {
    const newPlant = {
      nickname: "Fern",
      plant_location: "Living Room",
      common_name: "Monstera",
      scientific_name: ["Monstera deliciosa"],
      origin: "Central America",
      watering: "Water when the top inch of soil is dry",
      sunlight: "Bright, indirect light",
      description: "Monstera is known for its large, glossy, split leaves.",
      cycle: "Perennial",
      sunlight_care_guide: "Bright, indirect light",
      watering_care_guide: "Water when the top inch of soil is dry",
      pruning_care_guide: "Prune as needed to remove dead leaves",
    };
    return request(app)
      .post("/api/users/gardenGuru/plants")
      .send(newPlant)
      .expect(201)
      .then(({ body }) => {
        expect(body.plant).toEqual(
          expect.objectContaining({
            nickname: expect.any(String),
            plant_location: expect.any(String),
            common_name: expect.any(String),
            scientific_name: expect.any(Array),
            origin: expect.any(String),
            watering: expect.any(String),
            sunlight: expect.any(String),
            description: expect.any(String),
            cycle: expect.any(String),
            sunlight_care_guide: expect.any(String),
            watering_care_guide: expect.any(String),
            pruning_care_guide: expect.any(String),
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
        expect(body.plants.length).toBeGreaterThan(0);
        expect(body.plants[0]).toEqual(
          expect.objectContaining({
            nickname: expect.any(String),
            plant_location: expect.any(String),
            common_name: expect.any(String),
            scientific_name: expect.any(Array),
            origin: expect.any(String),
            watering: expect.any(String),
            sunlight: expect.any(String),
            description: expect.any(String),
            cycle: expect.any(String),
            sunlight_care_guide: expect.any(String),
            watering_care_guide: expect.any(String),
            pruning_care_guide: expect.any(String),
          })
        );
      });
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

describe("DELETE /api/users/:username/plants/:plantId", () => {
  test("Successfully deletes a plant from user's collection", async () => {
    // Add a plant
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
    });

    user.plants.push(plant._id);
    await user.save();

    // Attempt to delete the plant
    const response = await request(app)
      .delete(`/api/users/plantLover1/plants/${plant._id}`)
      .expect(200);

    expect(response.body.message).toBe("Plant deleted successfully");

    // Check if the plant is deleted
    const [updatedUser, deletedPlant] = await Promise.all([
      usersModel.findOne({ username: "plantLover1" }),
      plantModel.findById(plant._id),
    ]);

    expect(updatedUser.plants).not.toContain(plant._id);
    expect(deletedPlant).toBeNull();
  });

  test("Returns 404 if user is not found", async () => {
    const response = await request(app)
      .delete("/api/users/nonexistentuser/plants/someplantid")
      .expect(404);

    expect(response.text).toBe("User not found");
  });

  test("Returns 404 if plant is not in user's collection", async () => {
    const response = await request(app)
      .delete("/api/users/plantLover1/plants/nonexistentplantid")
      .expect(404);

    expect(response.text).toBe("Plant not found in user's collection");
  });
});

describe("PATCH /api/users/:username/plants/:plant_id", () => {
  test("Successfully updates a plant's nickname in the user's collection", async () => {
    const user = await usersModel.findOne({ username: "plantLover1" });

    const plant = await plantModel.create({
      common_name: "Peace Lily",
      plant_origin: "Tropical Americas",
      scientific_name: ["Spathiphyllum wallisii"],
      type: "Indoor",
      cycle: "Perennial",
      description:
        "Peace Lily is known for its white blooms and air-purifying qualities.",
      sunlight: "Low to bright indirect light",
      watering: "Keep the soil consistently moist",
      depth_of_water: "Shallow",
      last_watered: "2024-08-15",
      next_watering: "2024-08-22",
      watering_general_benchmark: { min: "Weekly", max: "Biweekly" },
      watering_period: "Weekly",
      volume_water_requirement: { min: "300ml", max: "500ml" },
      pruning_month: ["April", "October"],
      pruning_count: { times_per_year: 2 },
      maintenance: "Moderate",
      growth_rate: "Slow",
    });

    user.plants.push(plant._id);
    await user.save();

    const response = await request(app)
      .patch(`/api/users/plantLover1/plants/${plant._id}`)
      .send({ nickname: "My Lovely Lily" })
      .expect(200);

    expect(response.text).toBe("Plant updated successfully");

    const updatedPlant = await plantModel.findById(plant._id);

    expect(updatedPlant.nickname).toBe("My Lovely Lily");
  });

  test("Returns 404 if user is not found", async () => {
    const response = await request(app)
      .patch("/api/users/nonexistentuser/plants/someplantid")
      .send({ nickname: "Nonexistent Nickname" })
      .expect(404);
    console.log(response.text);
    expect(response.text).toBe("User not found");
  });

  test("Returns 404 if plant is not in user's collection", async () => {
    const response = await request(app)
      .patch("/api/users/plantLover1/plants/66c4999cc5fb78381f052b44")
      .send({ nickname: "Nonexistent Nickname" })
      .expect(404);

    expect(response.text).toBe("Plant not found");
  });
});

describe("PATCH /api/users/:currentUsername", () => {
  test("Successfully updates a user's username", () => {
    return request(app)
      .patch("/api/users/plantLover1")
      .send({ newUsername: "plantLover1Updated" })
      .expect(200)
      .then(({ body }) => {
        expect(body.message).toBe("Username updated successfully");
        expect(body.user.username).toBe("plantLover1Updated");
      });
  });

  test("Returns 409 when trying to update to an existing username", () => {
    return request(app)
      .patch("/api/users/greenThumb")
      .send({ newUsername: "botanicalBoss" })
      .expect(409)
      .then(({ body }) => {
        expect(body.message).toBe("Username already exists");
      });
  });

  test("Returns 404 when trying to update a non-existent user", () => {
    return request(app)
      .patch("/api/users/nonExistentUser")
      .send({ newUsername: "newUsername" })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User not found");
      });
  });

  test("Ensures the old username no longer exists after update", async () => {
    await request(app)
      .patch("/api/users/leafLover")
      .send({ newUsername: "leafLoverUpdated" })
      .expect(200);

    return request(app)
      .get("/api/users/leafLover")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("username not found");
      });
  });

  test("Ensures the user's plants are still associated after username update", async () => {
    const user = await usersModel.findOne({ username: "flowerFanatic" });
    const originalPlantCount = user.plants.length;

    await request(app)
      .patch("/api/users/flowerFanatic")
      .send({ newUsername: "flowerFanaticUpdated" })
      .expect(200);

    const updatedUser = await usersModel.findOne({
      username: "flowerFanaticUpdated",
    });
    expect(updatedUser.plants.length).toBe(originalPlantCount);
  });
});
