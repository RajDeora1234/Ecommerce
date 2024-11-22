import express from 'express'
const app = express();
import productRoute from "./routes/productRoute.js";
import { errorMiddleWare } from "./middleware/error.js";
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser";
import orderRoute from "./routes/orderRoute.js"
import bodyParser from 'body-parser';
import fileUpload from "express-fileupload";
import paymentRoute from "./routes/paymentRoute.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';


// app.use(cors());
// app.options("*", cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,      
// }));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the frontend URL
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "backend/config/config.env" });
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// routes
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);



app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
})

// middleware for errors
app.use(errorMiddleWare);


export default app;
