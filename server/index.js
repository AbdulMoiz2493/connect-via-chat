import express from 'express';
import dotenv from 'dotenv';
import userRouter from './Routes/userRoutes.js';
import authRouter from './Routes/authRouter.js';
import chatRouter from "./Routes/chatRouter.js";
import messageRouter from "./Routes/messageRouter.js";
import connectDB from './config/dbconnection.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { getSockets } from './utils/socketUtils.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { socketAuthenticator } from './Middlewares/token.js';
import Message from './Models/messageModel.js';
dotenv.config();
const socketsMapCollection = new Map();


const port = process.env.PORT || 80;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true, origin: true }))
connectDB();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});




app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
    )
});


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    if (socket.user && socket.user._id) {
        socketsMapCollection.set(socket.user._id.toString(), socket.id);
    }

    // Example event handler for new messages
    socket.on('NEW_MESSAGE', async ({ chatId, members, message }) => {
        try {
            // Handle your message logic here, including database operations
            const messageForRealTime = {
                _id: uuidv4(),
                message,
                sender: socket.user._id,
                createdAt: new Date().toISOString().toString()
            };

            // Emitting the event to relevant sockets
            const membersSocket = await getSockets(members, socketsMapCollection); // Implement getSockets function
            
            io.to(membersSocket).emit('NEW_MESSAGE', {
                chatId,
                message: messageForRealTime
            });



            try{
                const newMessage = new Message({
                    chat: chatId,
                    sender: socket.user._id,
                    content: message,  
                });
                await newMessage.save();
            } catch(err) {
                console.log("Error occured: ", err);
            }

        } catch (error) {
            console.error('Error processing message:', error);
            socket.disconnect();
        }
    })
});

server.listen(port, () => {
    console.log(`Server is Running on Port ${port}.`);
})

