import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: [true, "Name is required"],
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    maxlength: 10,
    minlength: 5,
    trim: true,
  },
  mobile: {
    type: String,
    maxlength: 10,
    minlength: 10,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
  },
  credits: { type: Number, default: 0 },
  lastLoginDate: {
    type: String,
    default: "",
  },

  profileCompleted: {
    type: Boolean,
    default: false,
  },

  interactions: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },

  creditHistory: [
    {
      amount: Number,
      reason: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tweetInteractions: {
    type: Map,
    of: {
      liked: Boolean,
      shared: Boolean,
      saved: Boolean,
      commented: Boolean,
    },
    default: {},
  },

  savedTweets: [
    {
      tweetId: String,
      tweetData: Object,
      savedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  role: String,
  info: String,
});

UserSchema.plugin(uniqueValidator);

const UserSchemaModel = mongoose.model("user_collection", UserSchema);

export default UserSchemaModel;
