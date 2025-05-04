import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    text: String,
    created_at: { type: Date },
    author_id: String,
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
