import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
