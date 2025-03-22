import mongoose, { Schema, Types } from "mongoose";


const messageSchema = new Schema({
    
    chat: {
        type: Types.ObjectId,
        ref: 'Chat',
        required: true,
    },

    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },

    content: {
        type: String,
    },

    attachments: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }

    
}, { timestamps: true});

const Message = mongoose.model("Message", messageSchema);


export default Message;