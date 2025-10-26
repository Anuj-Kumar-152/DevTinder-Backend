 const socket = require("socket.io");
 const crypto = require('crypto');
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

 const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId]
        .sort().join("_")).digest("hex");
 }


const initializeSocket = (server) => {
   
    const io = socket(server, {
        cors: {
            origin: process.env.FRONTED_URL,
            methods: ["GET", "POST"],
        },
    });
 

    io.on("connection", (socket) => {
        // handle events
        
        socket.on("joinChat", ({userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
             console.log("User joined room:", roomId);
            socket.join(roomId);
        }); 

        socket.on(
            "sendMessage",  
            async ({firstName, lastName, userId, targetUserId, text}) => {
                
                 

                // save message to the database
                try{

                    const roomId = getSecretRoomId(userId, targetUserId);
                    console.log(firstName+ " " + text);

                    // Home Work Please do 
                    // check userId and targetUserId are friend 
                    // ConnectionRequest.findOne({fromUserId: userId, toUserId: targetUserId, status: "accepted"})


                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId] },
                    })

                    if(!chat){
                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: [],
                        })
                    }

                    chat.messages.push({
                        senderId: userId, text,
                    });
 

                    await chat.save();
                    io.to(roomId).emit("messageReceived", {
                        firstName, 
                        lastName, 
                        text,
                        senderId: userId,  // ✅ add senderId
                        createdAt: new Date(), // optional, for frontend timestamp
                    });
                }
                catch (err){
                    console.log(err);
                } 

            }
        ); 

        socket.on("disconnect", () => {
            
        }); 
    
    });
};

module.exports = initializeSocket;