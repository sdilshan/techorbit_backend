import Blog from "../Schema/Blog.js";
import { nanoid } from "nanoid";

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      banner,
      des,
      content,
      tags,
      draft = false,
    } = req.body;

    const author = req.user.userId;
    // Validation
    if (!draft) {
      if (!title?.trim()) {
        return res.status(400).json({ error: "Title is required." });
      }

      if (!banner) {
        return res.status(400).json({ error: "Banner is required." });
      }

      if (!des?.trim()) {
        return res
          .status(400)
          .json({ error: "Description is required." });
      }

      if (des.length > 200) {
        return res
          .status(400)
          .json({ error: "Description cannot exceed 200 characters." });
      }

      if (!content || content.length === 0) {
        return res
          .status(400)
          .json({ error: "Blog content is required." });
      }

      if (!tags || tags.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one tag is required." });
      }

      if (tags.length > 5) {
        return res
          .status(400)
          .json({ error: "Maximum 5 tags are allowed." });
      }
    }

const normalizedTags = tags.map(tag => tag.trim().toLowerCase());
const slug = title
  .trim()
  .replace(/[^a-zA-Z0-9\s]/g, "")
  .replace(/\s+/g, "-")
  .toLowerCase();

const blog = new Blog({
      blog_id:  `${slug}-${nanoid()}`,
      title,
      banner,
      des,
      content,
      tags:normalizedTags,
      author,
      draft,
    });

    await blog.save();

    return res.status(201).json({
      message: "Blog created successfully.",
      blog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};