 
const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET_KEY);
};



module.exports = connectDB;



 





























// const mongoose = require("mongoose");

// const mongooseDB = async () => {
//     try {
//         await mongoose.connect(
//             "mongodb+srv://AnujNodejs:6Ff7U3z1StPr497b@mongodbnodejs.mkcuegu.mongodb.net/devTinder?retryWrites=true&w=majority"
//         );
//         console.log("✅ Database connection established...");
//     } catch (err) {
//         console.error("❌ Database connection failed!!!");
//     }
// };

// mongooseDB();