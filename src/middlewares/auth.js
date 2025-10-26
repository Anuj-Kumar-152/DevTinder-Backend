const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try{ 
        // read the token from the req cookies
        const token =  req.headers?.authorization?.split(" ")[1] || req.cookies?.token;
        
        
        if(!token){
            return res.status(401).send("Please Login!");
        }
        const decodedObj =  jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {_id} = decodedObj;
        // find the user
        const user = await User.findById(_id);

        if(!user){
            throw new Error("user not found!");
        }

        req.user = user;
        next();
    }
    catch (err){
        res.status(400 ).send("ERROR : "+err.message);
    }
    
};

module.exports = { 
    userAuth
};