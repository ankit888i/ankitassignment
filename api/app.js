import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/user.route.js";
import twitterRoutes from "./routes/twitter.route.js";
import storedTweetsRoute from "./routes/storedTweets.route.js";
import redditRoutes from "./routes/reddit.route.js";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/api/twitter", twitterRoutes);
app.use("/api", storedTweetsRoute);
app.use("/api/reddit", redditRoutes);
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
