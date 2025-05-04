import express from "express";
import Tweet from "../models/tweet.model.js";

const router = express.Router();

router.get("/stored-tweets", async (req, res) => {
  const { lastCreatedAt, limit = 10 } = req.query;

  const query = lastCreatedAt
    ? { created_at: { $lt: new Date(lastCreatedAt) } }
    : {};

  try {
    const tweets = await Tweet.find(query)
      .sort({ created_at: -1 })
      .limit(Number(limit));

    const nextCursor =
      tweets.length > 0 ? tweets[tweets.length - 1].created_at : null;

    res.json({
      data: tweets,
      hasMore: tweets.length === Number(limit),
      nextCursor,
    });
  } catch (error) {
    console.error("❌ Error fetching stored tweets:", error.message);
    res.status(500).json({ error: "Failed to fetch stored tweets" });
  }
});

export default router;
