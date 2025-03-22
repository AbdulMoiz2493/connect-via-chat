import User from "../Models/userModel.js"
import { generateHash, compareHash } from '../utils/authUtils.js';


export const updateUser = async (req, res) => {

    try {

        if (req.user._id.toString() !== req.params.userId.toString()) {
            return res.status(405).send({ status: "error", message: "You're not authorized to make this request" })
        }

        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).send({ status: "error", message: "Name and Email Should be provided." })
        }


        let updateUser = { name, email };

        const { oldPassword, newPassword, imageUrl } = req.body;
        if (oldPassword !== undefined && newPassword !== undefined) {
            const checkUser = await User.findById(req.user._id);
            const checkOldPassword = await compareHash(oldPassword, checkUser.password);
            if (!checkOldPassword) {
                return res.status(400).send({ status: "error", message: "Current Password is incorrect" });
            }
            const newHashedPassword = await generateHash(newPassword);
            updateUser.password = newHashedPassword;
        }

        if (imageUrl) {
            updateUser.image = imageUrl;
        }


        const userUpdated = await User.findByIdAndUpdate(req.user._id, updateUser, { new: true });

        if (!userUpdated) {
            return res.status(400).send({ status: "error", message: "Cannot update the user due to server error." });
        }

        const { password, ...rest } = userUpdated._doc;
        return res.status(200).send({ status: "success", userDetails: rest });

    } catch (err) {
        return res.status(400).send({ status: "error", message: "Server Error - Please try again later." });
    }

}



export const deleteUser = async (req, res) => {
    try {

        if (req.user._id.toString() !== req.params.userId.toString()) {
            return res.status(405).send({ status: "error", message: "You're not authorized to make this request" })
        }

        let deleteUser = await User.findByIdAndDelete(req.user._id);

        if(!deleteUser){
           return res.status(400).send({status: "error", message: "Cannot delete the user - Please try again."})
        }
        res.clearCookie('access_token');
        return res.status(200).send({status: "success", message: "User Deleted Successfully."});

    } catch(err) {
        return res.status(400).send({ status: "error", message: "Server Error - Please Try again later." })

    }
} 


export const getAllUser = async (req, res) => {
    try {

        // Exclude the password field from the result
        let users = await User.find({}, 'name email image').populate("name email image");
        

        // Filter out the current user from the list
        users = users.filter((user) => {
            return user._id.toString() !== req.user._id.toString();
        });


        return res.status(200).send({
            status: "success",
            users,
        });
    } catch (err) {
        console.error(err);  // Log the error for debugging

        return res.status(400).send({
            status: "error",
            message: "Server error - Please try again.",
        });
    }
};
