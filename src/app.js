const express = require("express"); // bring framework
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express(); // make server object
const cors = require("cors");

const http = require("http");

require("dotenv").config();


app.use(cors({
    origin: process.env.FRONTED_URL,
    credentials: true,
    methods:["GET","POST","PATCH","PUT"]
}));


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);


const server = http.createServer(app); 
initializeSocket(server);


connectDB()
    .then( () => {
        console.log("✅ Database connection estabilised successfully..."); 
        server.listen(8000, ()=> {
        console.log("server is listening successfully on port 8000");
});
    })
    .catch((err) => {
        console.error("❌ Database cannot be connected!!!");
    });

  



