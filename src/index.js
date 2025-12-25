import 'dotenv/config';
import express from "express";
import { connectDB } from "./db/index.js";

const app = express();

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is running on ${process.env.APP_URL}:${process.env.PORT}/`);
    })
}).catch((error)=>{
    console.log(`DB connection error`);
    process.exit(1);
})