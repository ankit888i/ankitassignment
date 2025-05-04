import express from "express";
import * as redditController from "../controller/reddit.controller.js";
const router = express.Router();

router.get("/save", redditController.getandstoreRedditPosts);
router.get("/fetch", redditController.fetchRedditPosts);
export default router;
