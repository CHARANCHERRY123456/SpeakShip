import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        console.log("Mongo DB Connected" , config.MONGO_URI.slice(0, 8));
    } catch (error) {
        console.log("Error in connecting " , error.message);
        process.exit(1);
    }
}

export default connectDB;