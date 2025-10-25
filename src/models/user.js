const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 25,
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email: "+ value);
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a Strong Password: "+ value);
                }
            }
        },
        age: {
            type: Number,
            required: true,
            min: 18,
        },
        gender: {
            type: String,
            lowercase: true,
            enum: {
                values: ["male", "female", "others"],
                message: `{VALUE} is incorrect status type`
            },
            required: true,
        },
        photoUrl: {
            type: String,
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid Photo Url: "+ value);
                }
            },
            default: "https://cyber.comolho.com/static/img/avatar.png",
        },
        about: {
            type: String,
            default: "This is a default about of the user! you can set your own about!!!"
        },
        skills: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);


userSchema.methods.getJWT = async function (){

    const user = this;
    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"});

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser){

    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;