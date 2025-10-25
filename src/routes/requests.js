const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({ message: "You cannot send a request to yourself!" });
        }

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status)){
            return res
                .status(400)
                .json({message: "Invalid status type :"+ status});
        }
 

        let toUser = null;
        if (mongoose.Types.ObjectId.isValid(toUserId)) {
            toUser = await User.findById(toUserId);
        }

        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        // if there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId,},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        })

        if(existingConnectionRequest){
            return res
                .status(400)
                .json({message: "Connection Request Already Exists!!!"});
        }

        const newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await newRequest.save();

        res.json({
            message: `${req.user.firstName} ${req.user.lastName} is ${status} in ${toUser.firstName} ${toUser.lastName}.` ,
            data,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Status not allowed!!"
            });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest){
            return res.status(404).json({
                message: "Connection request not found!!"
            });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message: "Connection request "+status, data});

    }
    catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }

});



module.exports = requestRouter;





// const express = require("express"); 
// const requestRouter = express.Router(); 
// const {userAuth} = require("../middlewares/auth");
// const connectionRequest = require("../models/connectionRequest");



// requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    
//     try{
//         const fromUserId = req.user._id;
//         const toUserId = req.params.toUserId;
//         const status = req.params.status;

//         const newConnectionRequest = new connectionRequest({
//             fromUserId,
//             toUserId,
//             status,
//         });

//         const data = await newConnectionRequest.save();

//         res.json({
//             message: fromUserId.firstName+" "+user.lastName+ " sending a connection request",
//             data,
//         });
//     }
//     catch (err){
//         res.status(400).send("ERROR : "+ err.message);
//     }
      

// });



// module.exports = requestRouter;