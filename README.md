# my-plants-BE

## About this repo

This repo is the backend of a mobile app project called My plant App. The concept of the app is targetted at people who like to collect plants and know how to care for them.

This repo uses MongoDb for the database and Express.js and Node.js to run the database and server.

## VIEW THE HOSTED BACKEND:

https://my-plants-be.onrender.com/api

## INSTRUCTIONS ON LOCAL USE

- To clone this repo on your local machine use the following link:

### HTTPS:

    git clone https://github.com/odonnellrory/my-plants-BE.git

### SSH:

    git clone git@github.com:odonnellrory/my-plants-BE.git

- To download the dependencies run the following command in the terminal:

  npm install

## RUNNING TESTS

To set up the databases on your local machine to allow for testing please do the following:

- To test the files:

  npm test [insert file name]

- The test suite on this repo is test.js you can run the tests by inputting the following command in the terminal:

  npm test test.js

## INFORMATION ON THE PROJECT

Users can identify a plant via picture or search bar, add the plant to their plant list and load the specific care plan for that plant. They can also set up push notifications to remind them which plant needs watering/ feeding and when.

Here are the list of endpoints available in this repo and the information they can send to the user:

### GET /api'

- Returns information on all available endpoints and descriptions of how they should be interacted with.

### POST '/api/register'

The information they contain are:

- username
- name
- email
- password

- Registers them as a new user, stores their login information into the users database.

### POST '/api/login'

- username
- password

- Users can sign in using their login information.

### GET '/api/users/:username'

- Returns a list of all the information of that user.

### POST '/api/users/:username/plants'

- Users can add a plant to a plant database which is stored in their user database.

### GET '/api/users/:username/plants'

- Returns a list of all the plants that have been added.

### GET '/api/users/:username/plants/:plant_id'

- Returns the list of information on that specific plant when given a valid plant_id.

### DELETE '/api/users/:username/plants/:plant_id'

- Users can delete a plant when given a valid plant_id.

### GET "/api/users/:username/plants_graveyard"

- Returns a list of all the plants that have been added to the plant graveyard.

### PATCH "/api/users/:username/plants/:plantId"

- Users can change a plants nickname.

### PATCH "/api/users/:username/plants/:plantId/water"

- Users can update a plants information when the plant has been last watered.

### PATCH "/api/users/:username/rewards"

- Users can update their reward count by watering a plant.

### PATCH "/api/users/:username/plants/:plantId/dead"

- Users can add a plant to the graveyard when given a valid plant_id.

## ERROR HANDLERS

A number of error handlers have also been created and tested to successfully take into account the different errors that could occur from a client's request.

These include:

- 400 error messages for invalid requests.
- 401 error messages for lacks valid authentication credentials.
- 404 error messages both with generic and specific messages if the request cannot be found.
- 409 error messages for when trying to create or update a resource that already exists or has conflicting information.
- 500 error message should the instance occur that there is a system issue.
