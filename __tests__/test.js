const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const { seed } = require('../seed/seed');

beforeAll( async () => {

  await seed();

});


afterAll(() => {

  mongoose.connection;

});

beforeEach( async () => {

    await  seed(); 
   
   });






describe('USERS', () => {




  test.only('POST: Returns 201 status code, can successfully register as a new user', () => {


    const newUser = {
      username: 'PlantQueen',
      name: 'Margaret',
      email: 'margaretlovesplants@hotmail.co.uk',
      password: 'Margaret'
    };


    return request(app)
      .post('/api/register')
      .send(newUser)
      .expect(201)

      .then(({ body }) => {

        expect(body.user).toHaveProperty('username', 'PlantQueen');
        expect(body.user).toHaveProperty('name', 'Margaret');
        expect(body.user).toHaveProperty('email', 'margaretlovesplants@hotmail.co.uk');
        expect(body.user).toHaveProperty('reward_points', 0);
        expect(body.user).toHaveProperty('profile_picture', 'https://gravatar.com/avatar/14f0c1272b4b2cc4ce5c969725cc71a0?s=200&d=mp&r=x');
        expect(body.user.plants).toEqual([]);
        expect(body.user).toHaveProperty('_id');
        expect(body.user).toHaveProperty('created_at');
        expect(body.user).toHaveProperty('__v', 0);
      });
  });



    test("POST: Returns 409 status message when the registration information already exists.", () => {

        const newUser = {
            username: "PlantQueen",
            name: "Margaret",
            email: "margaretlovesplants@hotmail.co.uk",
            password: "Margaret"
        }

        return request(app)
        .post("/api/register")
        .send(newUser)
        .expect(409)
        .then(({ body }) => {

            expect(body.msg).toBe("Already exists!")
        })


    });




    test.skip("POST: When user successfully creates a new account their password is secure and hashed.", () => {

        return request(app)
        .post("/api/login")
        .send(newUser)
        .expect(200)
        .then(({ body }) => {

            expect(body.user.password).toBe(Hashed-and-secure)

            //Need to find how to say its hashed and secure, and unique??

        })
    })




    test("POST: User can successfully login with their username and password, if they are an exisiting user.", () => {

        const loginInfo =  { 
            username: "PlantQueen",
            password: "margaret"
        }

        return request(app)
        .post("/api/login")
        .send(loginInfo)
        .expect(401)
        .then(({ body }) => {

            expect(body.msg).toBe("Unauthorised")
        })

    })


    test("POST: ", () => {


    })

    test("", () => {


    })
})




describe.skip("PLANTS", () => {

    test("POST: Returns 200 status code. Users can successfully add a new plant to their account", () => {

        return request(app)
        .post("/api/users/:username/plants")
        .expect(200)





    })

    test("", () => {


    })

    test("", () => {


    })

    test("", () => {


    })

    test("", () => {


    })
})