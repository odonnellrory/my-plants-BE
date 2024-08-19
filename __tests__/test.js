const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const { seed } = require("../seed/seed");

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
      email: "margaretlovesplants@hotmail.co.uk",
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
            email: "margaretlovesplants@hotmail.co.uk",
            reward_points: 0,
            password: expect.any(String),
            profile_picture:
              "https://gravatar.com/avatar/14f0c1272b4b2cc4ce5c969725cc71a0?s=200&d=mp&r=x",
            plants: expect.any(Array),
            _id: expect.any(String),
            created_at: expect.any(String),
            __v: expect.any(Number),
          })
        );
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

  test.skip("POST: When user successfully creates a new account their password is secure and hashed.", () => {
    return request(app)
      .post("/api/login")
      .send(newUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.password).toBe(Hashed - and - secure);

        //Need to find how to say its hashed and secure, and unique??
      });
  });

  test("POST: User can successfully login with their username and password, if they are an exisiting user.", () => {
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

  test("POST: ", () => {});

  test("", () => {});
});

describe("PLANTS", () => {
  test("POST: Returns 200 status code. Users can successfully add a new plant to their account", () => {
    const newplant = {
      plant_name: "Aloe Vera",
      plant_origin: "Arabian Peninsula",
      plant_type: "Succulent",
      plant_cycle: "Perennial",
      plant_description:
        "Aloe Vera is known for its medicinal properties and is often used in skincare products.",
      sunlight: "Bright, indirect light",
      water: "Water when the soil is completely dry",
    };
    return request(app)
      .post("/api/users/gardenGuru/plants")
      .send(newplant)
      .expect(200)
      .then(({ body }) => {
        expect(body.plant).toEqual(
          expect.objectContaining({
            plant_name: "Aloe Vera",
            plant_origin: expect.any(String),
            plant_type: expect.any(String),
            plant_cycle: expect.any(String),
            plant_description: expect.any(String),
            sunlight: expect.any(String),
            water: expect.any(String),
          })
        );
      });
  });

  test("", () => {});

  test("", () => {});

  test("", () => {});

  test("", () => {});
});
