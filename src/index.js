// import 'dotenv/config';
// import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants.js";

// const app = express();

// (async () => {
//     try {
//         console.log(`${process.env.MONGO_URI}/${DB_NAME}`);
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         app.on('error', (error) => {
//             console.error("app connection error");
//             throw error;
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`App listning on ${process.env.APP_URL}:${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("db connection error");
//         throw error;
//     }
// })();





import { connectDB } from "./db/index.js";
connectDB();