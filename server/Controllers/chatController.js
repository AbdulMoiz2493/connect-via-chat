import User from "../Models/userModel.js";
import Chat  from "../Models/chatModel.js";
import Message from "../Models/messageModel.js";


export const createChat = async (req, res) => {
    const members = req.body;
    try {
        // Validation: Check if exactly two members are provided
        if (members.length !== 2) {
            return res.status(400).send({ status: "error", message: "Please provide exactly two members." });
        }

        // Fetch both users using Promise.all and select only _id field
        const [user1, user2] = await Promise.all([
            User.findOne({ _id: members[0] }).select('_id'),
            User.findOne({ _id: members[1] }).select('_id')
        ]);

        // Check if both users exist
        if (!user1 || !user2) {
            return res.status(400).send({ status: "error", message: "User not found." });
        }

        // Check if a chat already exists between these two members
        const checkIfAlreadyCreated = await Chat.findOne({
            members: { $all: [members[0], members[1]] }
        });


        if (checkIfAlreadyCreated) {
            return res.status(400).send({ status: "error", message: "Chat is already created with these users." });
        }

        // Create a new Chat instance
        const newChat = new Chat({
            members: [members[0], members[1]]
        });

        // Save the new Chat instance
        const savedChat = await newChat.save();

        // Check if chat was saved successfully
        if (!savedChat) {
            return res.status(400).send({ status: "error", message: "Server error - Please try again." });
        }

        // Populate the members field in the savedChat object
        const populatedChat = await Chat.findById(savedChat._id).populate('members', 'name image email');

        // Return success response with created chat object
        return res.status(200).send({ status: "success", chat: populatedChat});

    } catch (error) {
        // Handle any unexpected errors
        console.error("Error in createChat:", error);
        return res.status(500).send({ status: "error", message: "Server error." });
    }
};

export const getChat = async (req, res) => {
    const chatId = req.params.chatId;

    // Validation: Check if chatId is provided
    if (!chatId) {
        return res.status(400).send({ status: "error", message: "Please provide Chat ID." });
    }

    try {
        // Query the database for the chat with the provided chatId
        const findChat = await Chat.findOne({ _id: chatId }).populate({
            path: 'members',
            select: "name email image",
        });

        // Check if chat exists
        if (!findChat) {
            return res.status(404).send({ status: "error", message: "Chat not found." });
        }

        // Return the chat object if found
        return res.status(200).send({ status: "success", chat: findChat });
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error in getChat:", error);
        return res.status(500).send({ status: "error", message: "Server error." });
    }
};


export const getAllChats = async (req, res) => {
    try {
        // Query for chats where the user's _id is in the members array
        const chats = await Chat.find({
            members: req.user._id
        }).populate({
            path: 'members',
            select: "name email image"
        });


        // Check if no chats are found
        if (!chats || chats.length === 0) {
            return res.status(404).send({ status: "error", message: "No chats found" });
        }

        // Return success response with the found chats
        return res.status(200).send({ status: "success", chats });

    } catch (err) {
        // Handle any unexpected errors
        console.error("Error in getAllChats:", err);
        return res.status(500).send({ status: "error", message: "Server error" });
    }
};

    

export const deleteChat = async (req, res) => {

    try{
        const chatId = req.params.chatId;
        
        // Validation: Check if chatId is provided
        if (!chatId) {
            return res.status(400).send({ status: "error", message: "Please provide Chat ID." });
        }
        
        // Query the database for the chat with the provided chatId
        const findChat = await Chat.findOne({ _id: chatId }).select('_id');

        // Check if chat exists
        if (!findChat) {
            return res.status(404).send({ status: "error", message: "Chat not found." });
        }

        await Message.deleteMany({chat: chatId});

        await Chat.deleteOne({_id: chatId});

        return res.status(200).send({status: "success", message: "Chat Deleted Successfully."})


    } catch(error) {
        // Handle any unexpected errors
        console.error("Error in Deleting chat:", error);
        return res.status(500).send({ status: "error", message: "Server error." });
    }
}



export const emptyChat = async (req, res) => {

    try{
        const chatId = req.params.chatId;
        
        // Validation: Check if chatId is provided
        if (!chatId) {
            return res.status(400).send({ status: "error", message: "Please provide Chat ID." });
        }
        
        // Query the database for the chat with the provided chatId
        const findChat = await Chat.findOne({ _id: chatId }).select('_id');

        // Check if chat exists
        if (!findChat) {
            return res.status(404).send({ status: "error", message: "Chat not found." });
        }

        await Message.deleteMany({chat: chatId});

        return res.status(200).send({status: "success", message: "Chat is Emptied Successfully."})


    } catch(error) {
        // Handle any unexpected errors
        console.error("Error in Emptying chat:", error);
        return res.status(500).send({ status: "error", message: "Server error." });
    }
}