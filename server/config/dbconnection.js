import mongoose, { mongo } from "mongoose";

const connectDB = () => {
    mongoose.connect(`${process.env.MONGO_DB_URL}`),
    console.log("Database Connected SuccessFully.");
}

export default connectDB;