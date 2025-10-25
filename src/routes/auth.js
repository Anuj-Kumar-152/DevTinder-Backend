 

const express = require("express"); 
const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
 
 

 

authRouter.post("/signup", async (req, res) => { 

    try{
        // validate the data
        validateSignUpData(req);
        // Encrypt the password
        const {firstName, lastName, emailId, password, age, gender, skills} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
         

        // creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            skills,
             
        });

         
   
       const savedUser = await user.save();
        res.json({message: "✅ User Added Successfully!!!", data: savedUser});
    }
    catch(err){
        res.status(400).send("Error during saving the user:"+err.message);
    }
    
});

authRouter.post("/login", async (req, res) => {

    try{

        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("EmailId is not present!!");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){

            // create a JWT Token
            const token = await user.getJWT();
            
            // Add to token to cookies and send to response back to the user

            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});

             
            res.send(user);
        }
        else{
            throw new Error("Wrong password");
        }
    }
    catch(err){
        res.status(400).send("Error during login: "+ err.message);
    }
});

 
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).send("Logout successfully!!");
});





module.exports = authRouter;