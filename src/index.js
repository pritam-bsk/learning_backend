import 'dotenv/config';
import { connectDB } from "./db/index.js";
import { app } from './app.js';

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is running on ${process.env.APP_URL + process.env.PORT}/`);
    })
})