import User from "../Models/userModel.js";
import Chat  from "../Models/chatModel.js";
import Message from "../Models/messageModel.js";

export const getMessages = async (req, res) => {
    const chatId = req.params.chatId;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    try {
        let chat = await Chat.findById({_id: chatId}).populate("_id");

        if (!chat) {
            return res.status(400).send({status: "error", message: "No chat found."});
        }

        const messages = await Message.find({chat: chatId})
                                     .sort({ createdAt: -1 }) // Fetch newest messages first
                                     .skip(offset)
                                     .limit(limit);
        
        let chatMessages = messages.map((message) => {
            return {
                chatId: message.chat,
                message: {
                    sender: message.sender,
                    createdAt: message.createdAt,
                    message: message.content,
                    _id: message._id,
                }
            };
        });

        return res.status(200).send({status:"success", chatMessages});

    } catch (err) {
        res.status(400).send({status:"error", message: "Server Error - Please Refresh the page."});
    }
}
