import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/myapp`);
        console.log(`MONGODB connected | HOST: ${conn.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}