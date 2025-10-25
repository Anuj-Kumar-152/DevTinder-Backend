 
 

const validator = require("validator");

const validateSignUpData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid, Please Enter Valid name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter strong password");
    }

};




const validateEditProfileData = (req) => {

    const allowedEditFeilds = ["firstName", "lastName", "age", "photoUrl", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFeilds.includes(field));

    return isEditAllowed;
};



module.exports = {
    validateSignUpData, 
    validateEditProfileData,
};