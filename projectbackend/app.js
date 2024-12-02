const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const axios = require("axios");

app.use(express.json());



const mongourl = "mongodb+srv://pdiya2912:food@cluster0.lj4tn3q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const JET_SECRET = "jhgsahfdh1gvvghgvd878()xzvfc76hiuguhbjh8i7[]]nkjno98jh";

mongoose.connect(mongourl).then(()=>{
    console.log("Database connected")
}).catch((e)=>{
    console.log(e);
})


require('./UserDetails')

const User =mongoose.model("UserInfo");
    app.get("/",(req,res)=>{
        res.send({status:"Started"})
    })

    app.post('/register',async(req,res)=>{
        const {name,email,mobile,password,userType} = req.body;
        const oldUser = await User.findOne({email:email})
        if(oldUser){
            return res.send({data:"User already exists!"})
        }

        const encryptedpassword = await bcrypt.hash(password,10)
        try{
            await User.create({
                name:name,
                email:email,
                mobile,
                password:encryptedpassword,
                userType
            })
            res.send({status:"ok",data:"User created"})

        }catch(error){
            res.send({status:"error",data:error})
        }
    })

    app.post("/login-user",async(req,res)=>{
        const {email,name,password} = req.body;
        const oldUser = await User.findOne({email:email});

        if(!oldUser){
            return res.send({data:"User dosen't exists!"})
        }

        if(await bcrypt.compare(password,oldUser.password)){
            const token = jwt.sign({email:oldUser.email},JET_SECRET);
            console.log(token);
            if(res.status(201)){
                return res.send({status:"ok",data:token,userType:oldUser.userType})
            }else{
                return res.send({error:"error"})
            }
        }
        
    })

    app.post("/userdata", async (req, res) => {
        const { token } = req.body;
        try {
          const verified = jwt.verify(token, JET_SECRET); // Verify token
          const userEmail = verified.email; // Extract email from token
          const userData = await User.findOne({ email: userEmail }); // Find user by email
          if (userData) {
            return res.send({ status: "ok", data: userData });
          } else {
            return res.send({ status: "error", data: "User not found" });
          }
        } catch (error) {
          return res.send({ status: "error", data: error });
        }
      });

      app.get('/get-all-user',async(req,res)=>{
        try{
            const data = await User.find({})
            res.send({status: "Ok",data:data})
        }catch(error){
            return res.send({ status: "error", data: error });
        }
      })

      app.post('/delete-user',async(req,res)=>{
        const {id} = req.body;
        try{
            await User.deleteOne({_id:id});
            res.send({status:"Ok",data:"User Deleted"});
        }catch(error){
            return res.send({ status: "error", data: error });
        }
      })

      app.post("/updateUser", async (req, res) => {
        const { token, userDetails } = req.body;
        try {
            const verified = jwt.verify(token, JET_SECRET);
            const userEmail = verified.email;
    
            const user = await User.findOne({ email: userEmail });
    
            if (user) {
                user.name = userDetails.name || user.name;
                user.email = userDetails.email || user.email;
                user.mobile = userDetails.mobile || user.mobile; // Update mobile
                user.userType = userDetails.userType || user.userType;
                user.address = userDetails.address || user.address; // Update address
    
                await user.save();
                return res.send({ status: "ok", data: "Details saved successfully" });
            } else {
                return res.send({ status: "error", data: "User not found" });
            }
        } catch (error) {
            return res.send({ status: "error", data: error.message });
        }
    });

      app.post("/save-user-details", async (req, res) => {
        const { token, userDetails } = req.body; // Token and user details from the frontend
        try {
          const verified = jwt.verify(token, JET_SECRET); // Use the correct secret key
          const userEmail = verified.email;
          const user = await User.findOne({ email: userEmail });
      
          if (user) {
            // Save user-specific data in the database
            // For simplicity, I'm saving the data as part of the user object, but this can be in a separate collection as needed
            user.userDetails = userDetails;
            await user.save();
            return res.send({ status: "ok", data: "Details saved successfully" });
          } else {
            return res.send({ status: "error", data: "User not found" });
          }
        } catch (error) {
          return res.send({ status: "error", data: error.message });
        }
      });
    // Route to get recipe suggestions
    
// app.post('/get-recipe-suggestions', async (req, res) => {
//     const { userDetails } = req.body;

//     if (!userDetails) {
//         return res.status(400).json({ error: 'Missing user details' });
//     }

//     try {
//         const SPOONACULAR_API_KEY = `ce0c05a14f8e48e694235428c310ea98`;
//         const { foodPreference, difficulty, calories } = userDetails;

//         const params = {
//             apiKey: SPOONACULAR_API_KEY,
//             number: 10,
//             diet: foodPreference !== 'None' ? foodPreference.toLowerCase() : undefined,
//             maxCalories: calories.max,
//             minCalories: calories.min,
//             instructionsRequired: true,
//         };

//         const apiResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });

//         if (apiResponse.data && apiResponse.data.results) {
//             const recipes = apiResponse.data.results.map(recipe => ({
//                 id: recipe.id,
//                 title: recipe.title,
//                 readyInMinutes: recipe.readyInMinutes,
//                 imageUrl: recipe.image,
//             }));
//             res.json({ recipes });
//         } else {
//             res.status(404).json({ error: 'No recipes found' });
//         }
//     } catch (error) {
//         console.error('Error fetching recipes:', error.message);
//         res.status(500).json({ error: 'Failed to fetch recipes' });
//     }
// });
    
app.post('/get-recipe-suggestions', async (req, res) => {
    const { userDetails } = req.body;

    if (!userDetails) {
        return res.status(400).json({ error: 'Missing user details' });
    }

    try {
        const SPOONACULAR_API_KEY = '42cc4e98d2fb4e8f8ea30b83f36ebbc4';
        const { foodPreference, difficulty, calories, healthConditions, minutes, weight } = userDetails;

        // Map difficulty level to max preparation time (in minutes)
        const difficultyMap = {
            easy: 30,
            medium: 60,
            hard: 120
        };

        // Build the params object dynamically to include all necessary filters
        const params = {
            apiKey: SPOONACULAR_API_KEY,
            number: 10,
            diet: foodPreference && foodPreference !== 'None' ? foodPreference.toLowerCase() : undefined,
            maxCalories: calories?.max || undefined,
            minCalories: calories?.min || undefined,
            maxReadyTime: minutes || difficultyMap[difficulty?.toLowerCase()],
            instructionsRequired: true,
            intolerances: healthConditions?.join(','), // Join health conditions as intolerances
            weight: weight || undefined,
        };

        const apiResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });

        if (apiResponse.data && apiResponse.data.results) {
            const recipes = apiResponse.data.results.map(recipe => ({
                id: recipe.id,
                title: recipe.title,
                readyInMinutes: recipe.readyInMinutes,
                imageUrl: recipe.image,
            }));
            res.json({ recipes });
        } else {
            res.status(404).json({ error: 'No recipes found' });
        }
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});



app.listen(5001,()=>{
    console.log("Node js server is started");
})