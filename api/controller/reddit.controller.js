import "../models/connection.js";
import RedditPostModel from "../models/reddit.model.js";

export const getandstoreRedditPosts = async (req, res) => {
  try {
    const response = await fetch(
      "https://www.reddit.com/r/javascript/top.json?limit=10"
    );
    const data = await response.json();

    const posts = data.data.children.map((item) => ({
      reddit_id: item.data.id,
      title: item.data.title,
      url: item.data.url,
      score: item.data.score,
      created_utc: item.data.created_utc,
    }));

    await RedditPostModel.deleteMany({});
    await RedditPostModel.insertMany(posts);

    res.status(200).json({ message: "Data fetched and stored successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchRedditPosts = async (req, res) => {
  try {
    const posts = await RedditPostModel.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
