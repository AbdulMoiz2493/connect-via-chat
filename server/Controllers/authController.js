import validator from 'node-email-validation';
import jwt from "jsonwebtoken";
import User from '../Models/userModel.js';
import { generateHash, compareHash } from '../utils/authUtils.js';


//Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;


    //Checking if email and password are provided.
    if (!email || !password) {
        return res.status(400).send({ status: "Error", message: "Email or Password not provided" });
    }

    //Checking if email exists.
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        return res.status(400).send({ status: "Error", message: "Incorrect Email or Password" });
    }

    //Comparing passwords.
    try {
        const comparePassword = await compareHash(password, findUser.password);
        if (!comparePassword) {
            return res.status(400).send({ status: "Error", message: "Incorrect Password" });
        }

    } catch (err) {
        return res.status(400).send({ status: "Error", message: "Server Error: Error in comparing passwords." });
    }

    //If all validation passes, then generate token and send it as a response.
    const user = {
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
    }
    const token = jwt.sign(user, process.env.SECRET_KEY);

    //if token can't be generated then send error.
    if (!token) {
        return res.status(400).send({ status: "Error", message: "Server Error: Failed to create token." });
    }


    //Send cookie and user details except password.
    let { password: hashedPassword, ...rest } = findUser._doc;
    res.cookie("access_token", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
        .status(200).send({ status: "success", userDetails: rest });

}






//Signup Controller.
export const signup = async (req, res) => {

    const { name, email, password, cpassword } = req.body;

    try {
        //Validating credentials
        if (!name) {
            return res.status(400).send({ status: "error", message: "Name is not provided" })
        }

        if (password !== cpassword) {
            return res.status(400).send({ status: "error", message: "Password Does not Match" });
        }

        if (!validator.is_email_valid(email)) {
            return res.status(400).send({ status: "error", message: "Invalid Email Provided" });

        }


        //Checking if email already registered.
        const findUser = await User.findOne({ email: email });

        if (findUser) {
            return res.status(400).send({ status: "error", message: "Email is Already Registered" });
        }


        //Encrypting password
        const hashPassword = await generateHash(password);
        if (!hashPassword) {
            return res.status(400).send({ status: "error", message: "Server Error - Error in reading hash, Try Again Later" });
        }

        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });


        //Saving to the DB.
        await newUser.save()

        return res.status(200).send({ status: 'success', message: "User Registered Successfully." });

    } catch (err) {
        res.send(err);
    }
}



// Google Auth-Controller
export const google = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).send({ status: "Error", message: "Incomplete information provided" });
    }

    try {
        const findUser = await User.findOne({ email });

        //If user already exists, then send response, token, cookie
        if (findUser) {
            const user = {
                _id: findUser._id,
                name: findUser.name,
                email: findUser.email,
            }

            const token = jwt.sign(user, process.env.SECRET_KEY);

            //if token can't be generated then send error.
            if (!token) {
                return res.status(500).send({ status: "Error", message: "Server Error: Failed to create token." });
            }

            //Send cookie and user details except password.
            let { password: hashedPassword, ...rest } = findUser._doc;
            return res.cookie("access_token", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
                .status(200).send({ status: "success", userDetails: rest });

        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await generateHash(generatePassword);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });

            await newUser.save();
            const token = jwt.sign({ _id: newUser._id, name, email }, process.env.SECRET_KEY);

            //if token can't be generated then send error.
            if (!token) {
                return res.status(500).send({ status: "Error", message: "Server Error: Failed to create token." });
            }

            //Send cookie and user details except password.
            let { password: hashedPasswords, ...rest } = newUser._doc;
            return res.cookie("access_token", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
                .status(200).send({ status: "success", userDetails: rest });
        }
    } catch (err) {
        return res.status(500).send({ status: "Error", message: "Server Error Occured. Please Try Again Later." });
    }
}

//Logout Controller
export const logout = (req, res) => {
    try{
        res.clearCookie("access_token")
        return res.status(200).send({status: "success", message: "Logout Successfully."});
    } catch(err) {
        return res.status(400).send({status: "success", message: "Server Error - Please try again later."});
    }
}