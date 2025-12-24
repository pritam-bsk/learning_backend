import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import 'dotenv/config'

export const connectDB = async () => {
    try {
        const connectionInst = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MONGODB connected | HOST: ${connectionInst.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

