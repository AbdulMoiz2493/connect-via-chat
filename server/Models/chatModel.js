import mongoose, { Schema, Types } from "mongoose";


const chatSchema = new Schema({
    members: [{
        type: Types.ObjectId,
        ref: "User",
        required: true,
    }],
    
}, { timestamps: true});

const Chat = mongoose.model("Chat", chatSchema);


export default Chat;