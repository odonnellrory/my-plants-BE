const express = require("express")
const mongoose = require("mongoose")
const app = express()
const bcrypt = require("bcrypt");

app.use(express.json())

mongoose.connect("mongodb+srv://dbuser:admin001@plant-app.8jgjf.mongodb.net/My-plant-app")

const userSchema = new mongoose.Schema(

    {

        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        reward_points:  { type: Number, default: 0 },
        password: { type: String, required: true },
        profile_picture: { type: String, default: "https://gravatar.com/avatar/14f0c1272b4b2cc4ce5c969725cc71a0?s=200&d=mp&r=x"},
        created_at: { type: Date, default: Date.now },
        plant_count: { type: Number },
        plants: [{ type: mongoose.Schema.Types.ObjectId, ref: "plants" }]

    }
)

const usersModel = mongoose.model("user", userSchema);

const plantSchema = new mongoose.Schema(
    
    {

        plant_name: { type: String },
        plant_origin: { type: String },
        plant_type: { type: String },
        plant_cycle: { type: String },
        plant_description: { type: String },
        sunlight: { type: String },
        water: { type: String },
        date_added: { type: Date, default: Date.now }

    },
    
    { strict: false }

)


const plantModel = mongoose.model("plants", plantSchema);




app.post('/api/register', async (req, res) => {

    const { username, name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        //salt makes it secure in the hash process "10 rounds of salt". A way to generate that hash for security. 
      
        const newUser = new usersModel({ username, name, email, password: hashedPassword });
        
        const user = await newUser.save();

        res.status(201).send({ message: 'Successfully registered!', user });

    } 

    catch (error) {

        console.error(error); 

        res.status(400).send(error);
    }

});




app.post('/api/login', async (req, res) => {

     const { username, password } = req.body;

    try {

        const user = await usersModel.findOne({username});

        if(!user){

            return res.status(404).send("username not found")

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){

            return res.status(401).send("password incorrect, please try again!")

        }

        res.status(200).send(`Welcome back ${user.name}`)


    } catch (error) {

        console.log(error)

        res.status(400).send(error)
        
    }
});




app.post('/api/users/:user_id/plants', (req, res) => {

    const { user_id } = req.params;

    const { plant_name, plant_origin, plant_type, plant_cycle, plant_description, sunlight, water } = req.body;

    const newPlant = new plantModel({ plant_name, plant_origin, plant_type, plant_cycle, plant_description, sunlight, water });

    newPlant.save().then((plant) => {

    return usersModel.findById(user_id).then((user) => {

        if(!user){
            return res.status(404).send({message: "Sorry!"})
        }

        user.plants.push(plant._id)
        user.plant_count = user.plants.length;

        return user.save().then(() => {

            res.status(200).send({plant})

        })
    })

    }).catch((error) => {

        console.log(error)

        res.status(400).send(error)

    })
});




app.listen(9000, () => {

    console.log("Listening on port 9000!!!!")

});








