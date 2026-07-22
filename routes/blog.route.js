import express from "express";
import { createBlog } from "../controllers/blogController.js";
import { verifyJWT } from "../middleware/auth.js";
const router = express.Router();

router.post("/create-blog", verifyJWT, createBlog);

export default router;