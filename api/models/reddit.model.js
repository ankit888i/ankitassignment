import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    reddit_id: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    created_utc: {
      type: Number,
      required: true,
    },
    subreddit: {
      type: String,
      required: true,
    },
    upvote_ratio: {
      type: Number,
      default: 0,
    },
    num_comments: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    selftext: {
      type: String,
      default: "",
    },
    is_self: {
      type: Boolean,
      default: false,
    },
    fetched_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

postSchema.index({ subreddit: 1 });

const RedditPostModel = mongoose.model("Reddit_Post", postSchema);

export default RedditPostModel;
