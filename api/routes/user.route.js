import express from "express";

const router = express.Router();

import * as userController from "../controller/user.controller.js";

router.post("/save", userController.save);
router.post("/login", userController.login);
router.post("/interaction", userController.recordUserInteraction);
router.get("/fetch", userController.fetch);
router.patch("/update", userController.update);
router.delete("/delete", userController.deleteUser);
router.get("/profile/:userId", userController.getProfile);

router.post("/save-tweet", userController.saveTweet);
router.post("/report-tweet", userController.reportTweet);
router.get("/saved-tweets/:userId", userController.getSavedTweets);

router.post("/complete-profile", userController.completeProfile);

router.get("/credit-history/:userId", userController.getCreditHistory);

router.post("/update-credits", userController.updateCredits);

export default router;
