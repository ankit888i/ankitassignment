import express from "express";
import axios from "axios";
import Tweet from "../models/tweet.model.js";

const router = express.Router();

router.get("/trending", async (req, res) => {
  try {
    console.log("Fetching tweets from Twitter API...");

    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent?query=india&tweet.fields=created_at,author_id",
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    console.log("Twitter API raw response:", response.data);

    const tweets = response.data.data;

    if (Array.isArray(tweets)) {
      console.log(`Received ${tweets.length} tweets. Storing to DB...`);
      for (const tweet of tweets) {
        try {
          tweet.created_at = new Date(tweet.created_at);

          await Tweet.updateOne(
            { id: tweet.id },
            { $set: tweet },
            { upsert: true }
          );
        } catch (e) {
          console.error("❌ Failed to store tweet:", e.message);
        }
      }

      return res.json({ stored: tweets.length, data: tweets });
    } else {
      console.warn("⚠️ No tweets returned from Twitter API.");
      return res.json({ stored: 0, data: [] });
    }
  } catch (error) {
    if (error.response?.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    }

    console.error(
      "❌ Twitter API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch tweets from Twitter API" });
  }
});

export default router;
