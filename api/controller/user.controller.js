import "../models/connection.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import rs from "randomstring";
import url from "url";

import UserSchemaModel from "../models/user.model.js";

export const save = async (req, res) => {
  var userList = await UserSchemaModel.find();
  var l = userList.length;
  var _id = l == 0 ? 1 : userList[l - 1]._id + 1;

  let userDetail = {
    ...req.body,
    _id: _id,
    role: "user",
    credits: 5,
    creditHistory: [
      {
        amount: 5,
        reason: "Account Registration",
        timestamp: new Date(),
      },
    ],
    info: Date(),
  };

  try {
    await UserSchemaModel.create(userDetail);
    res.status(201).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false });
  }
};

export const login = async (req, res) => {
  let condition_obj = { ...req.body };
  let userList = await UserSchemaModel.find(condition_obj);
  if (userList.length != 0) {
    const user = userList[0];
    const today = new Date().toLocaleDateString();

    if (user.lastLoginDate !== today) {
      await UserSchemaModel.updateOne(
        { _id: user._id },
        {
          $set: { lastLoginDate: today },
          $inc: { credits: 10 },
          $push: {
            creditHistory: {
              amount: 10,
              reason: "Daily Login Bonus",
              timestamp: new Date(),
            },
          },
        }
      );
    }

    const payload = { subject: user.email };
    const key = rs.generate();
    const token = jwt.sign(payload, key);

    const updatedUser = await UserSchemaModel.findOne({ _id: user._id });

    res.status(200).json({ token: token, users: updatedUser });
  } else {
    res.status(500).json({ error: "token error" });
  }
};

export const recordUserInteraction = async (req, res) => {
  const { userId, tweetId, action, delta } = req.body;
  console.log("Interaction request:", req.body);

  if (!userId || !tweetId || !action || typeof delta !== "number") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const user = await UserSchemaModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.interactions) {
      user.interactions = {
        likes: 0,
        shares: 0,
        comments: 0,
      };
    }

    if (action === "like") {
      user.interactions.likes += delta > 0 ? 1 : -1;
    } else if (action === "share") {
      user.interactions.shares += delta > 0 ? 1 : -1;
    } else if (action === "comment" || action === "save") {
      user.interactions.comments += delta > 0 ? 1 : -1;
    } else {
      return res.status(400).json({ error: "Invalid action type" });
    }

    user.interactions.likes = Math.max(0, user.interactions.likes);
    user.interactions.shares = Math.max(0, user.interactions.shares);
    user.interactions.comments = Math.max(0, user.interactions.comments);

    if (!user.tweetInteractions) {
      user.tweetInteractions = {};
    }

    if (!user.tweetInteractions[tweetId]) {
      user.tweetInteractions[tweetId] = {
        liked: action === "like" && delta > 0,
        shared: action === "share" && delta > 0,
        saved: action === "save" && delta > 0,
        commented: action === "comment" && delta > 0,
      };
    } else {
      if (action === "like") {
        user.tweetInteractions[tweetId].liked = delta > 0;
      } else if (action === "share") {
        user.tweetInteractions[tweetId].shared = delta > 0;
      } else if (action === "save") {
        user.tweetInteractions[tweetId].saved = delta > 0;
      } else if (action === "comment") {
        user.tweetInteractions[tweetId].commented = delta > 0;
      }
    }

    user.credits = (user.credits || 0) + delta;
    user.creditHistory.push({
      amount: delta,
      reason: `${action.charAt(0).toUpperCase() + action.slice(1)} interaction`,
      timestamp: new Date(),
    });

    await user.save();
    console.log("Updated user interactions:", user.interactions);
    return res.status(200).json({
      message: "Interaction recorded",
      interactions: user.interactions,
    });
  } catch (err) {
    console.error("Interaction error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const fetch = async (req, res) => {
  var condition_obj = url.parse(req.url, true).query;
  var userList = await UserSchemaModel.find(condition_obj);

  if (userList.length != 0) {
    res.status(201).json(userList);
  } else {
    res.status(404).json({ msg: "Resource not found" });
  }
};

export const update = async (req, res) => {
  var condition_obj = req.body.condition_obj;
  var userList = await UserSchemaModel.find(condition_obj);

  if (userList.length != 0) {
    var user = await UserSchemaModel.updateOne(req.body.condition_obj, {
      $set: req.body.content_obj,
    });
    if (user) {
      res.status(200).json({ msg: "resource updated successfully" });
    } else {
      res.status(500).json({ msg: "error" });
    }
  } else {
    res.status(404).json({ msg: "Detail not found" });
  }
};

export const deleteUser = async (req, res) => {
  let userDetails = await UserSchemaModel.findOne(req.body);
  if (userDetails) {
    let user = await UserSchemaModel.deleteOne(req.body);
    if (user) res.status(200).json({ msg: "success" });
    else res.status(500).json({ status: "Server Error" });
  } else res.status(404).json({ status: "Requested resource not available" });
};

export const completeProfile = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserSchemaModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.profileCompleted) {
      return res
        .status(400)
        .json({ error: "Profile already marked as complete" });
    }

    const requiredFields = [
      "name",
      "email",
      "mobile",
      "address",
      "city",
      "gender",
    ];
    const isComplete = requiredFields.every(
      (field) => user[field] && user[field].toString().trim() !== ""
    );

    if (!isComplete) {
      return res
        .status(400)
        .json({ error: "All profile fields must be completed" });
    }

    await UserSchemaModel.updateOne(
      { _id: userId },
      {
        $set: { profileCompleted: true },
        $inc: { credits: 20 },
        $push: {
          creditHistory: {
            amount: 20,
            reason: "Profile Completion Bonus",
            timestamp: new Date(),
          },
        },
      }
    );

    const updatedUser = await UserSchemaModel.findOne({ _id: userId });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const recordInteraction = async (req, res) => {
  const { userId, tweetId, action, delta } = req.body;
  console.log(req.body);
  if (!userId || !tweetId || !action || typeof delta !== "number") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const user = await UserSchemaModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.interactions) user.interactions = new Map();

    const currentInteraction = user.interactions.get(tweetId) || {
      liked: false,
      shared: false,
      saved: false,
    };

    if (action === "like") {
      currentInteraction.liked = !currentInteraction.liked;
    } else if (action === "share") {
      currentInteraction.shared = !currentInteraction.shared;
    } else if (action === "save") {
      currentInteraction.saved = !currentInteraction.saved;
    } else {
      return res.status(400).json({ error: "Invalid action type" });
    }

    user.interactions.set(tweetId, currentInteraction);

    user.credits = (user.credits || 0) + delta;
    user.creditHistory.push({
      amount: delta,
      reason: `${action} tweet`,
    });

    await user.save();
    return res.status(200).json({ message: "Interaction recorded" });
  } catch (err) {
    console.error("Interaction error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCreditHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserSchemaModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      credits: user.credits,
      history: user.creditHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const adjustCredits = async (req, res) => {
  const { userId, amount, reason } = req.body;
  const adminId = req.userId;

  try {
    const admin = await UserSchemaModel.findOne({ _id: adminId });
    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const user = await UserSchemaModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (amount < 0 && Math.abs(amount) > user.credits) {
      return res
        .status(400)
        .json({ error: "Cannot deduct more credits than user has" });
    }

    await UserSchemaModel.updateOne(
      { _id: userId },
      {
        $inc: { credits: amount },
        $push: {
          creditHistory: {
            amount: amount,
            reason: reason || `Manual adjustment by admin`,
            timestamp: new Date(),
          },
        },
      }
    );

    const updatedUser = await UserSchemaModel.findOne({ _id: userId });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserSchemaModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const saveTweet = async (req, res) => {
  const { userId, tweetId, tweetData, saved } = req.body;

  const validatedTweetData = {
    name: tweetData.name || "Unknown User",
    username: tweetData.username || "unknown",
    content: tweetData.content || "",
    avatar: tweetData.avatar || "/default-avatar.png",
  };

  try {
    const user = await UserSchemaModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.savedTweets) {
      user.savedTweets = [];
    }

    if (saved) {
      const tweetExists = user.savedTweets.some(
        (tweet) => tweet.tweetId === tweetId
      );

      if (!tweetExists) {
        user.savedTweets.push({
          tweetId,
          tweetData: validatedTweetData,
          savedAt: new Date(),
        });
      }
    } else {
      user.savedTweets = user.savedTweets.filter(
        (tweet) => tweet.tweetId !== tweetId
      );
    }

    if (!user.interactions) {
      user.interactions = {};
    }

    if (!user.interactions[tweetId]) {
      user.interactions[tweetId] = {};
    }

    user.interactions[tweetId].saved = saved;

    await user.save();
    res.status(200).json({ message: saved ? "Tweet saved" : "Tweet unsaved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const reportTweet = async (req, res) => {
  const { userId, tweetId, tweetData, reason } = req.body;

  try {
    if (!(await UserSchemaModel.findById(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    let ReportCollection;
    try {
      ReportCollection = mongoose.model("report_collection");
    } catch (e) {
      const ReportSchema = mongoose.Schema({
        userId: Number,
        tweetId: String,
        tweetData: Object,
        reason: String,
        status: {
          type: String,
          enum: ["pending", "reviewed", "resolved"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      });

      ReportCollection = mongoose.model("report_collection", ReportSchema);
    }

    const existingReport = await ReportCollection.findOne({ userId, tweetId });
    if (existingReport) {
      return res
        .status(400)
        .json({ error: "You've already reported this tweet" });
    }

    await ReportCollection.create({
      userId,
      tweetId,
      tweetData,
      reason,
    });

    const user = await UserSchemaModel.findById(userId);
    if (!user.interactions) {
      user.interactions = {};
    }

    if (!user.interactions[tweetId]) {
      user.interactions[tweetId] = {};
    }

    user.interactions[tweetId].reported = true;
    await user.save();

    res.status(201).json({ message: "Tweet reported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSavedTweets = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserSchemaModel.findById(userId).select("savedTweets");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User's saved tweets from DB:", user.savedTweets);

    res.status(200).json(user.savedTweets || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCredits = async (req, res) => {
  const { userId, amount, reason } = req.body;

  try {
    const user = await UserSchemaModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (amount < 0 && Math.abs(amount) > user.credits) {
      return res
        .status(400)
        .json({ error: "Cannot deduct more credits than user has" });
    }

    await UserSchemaModel.updateOne(
      { _id: userId },
      {
        $inc: { credits: amount },
        $push: {
          creditHistory: {
            amount: parseInt(amount), // Ensure amount is an integer
            reason: reason || `Manual adjustment by admin`,
            timestamp: new Date(),
          },
        },
      }
    );

    const updatedUser = await UserSchemaModel.findOne({ _id: userId });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error in adjustCredits:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
