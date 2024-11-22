
import app from "./app.js";
import cloudinary from "cloudinary";
import { dataBaseConnect } from "./config/database.js";
import dotenv from "dotenv";

// handling uncought exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down due to uncought exception");

    process.exit(1);

});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "backend/config/config.env" });
}

dataBaseConnect();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)

});


// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down due to unhandled promise rejection");

    server.close(() => {
        process.exit(1);
    })
});
