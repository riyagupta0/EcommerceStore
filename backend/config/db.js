import mongoose from "mongoose";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Successfully connected to mongoDB");

    } catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;