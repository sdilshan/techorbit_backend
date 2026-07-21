import s3 from "../config/s3.js";
import { v4 as uuid } from "uuid";
import "dotenv/config";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const file = req.file;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `blog-images/${uuid()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();

    return res.status(200).json({
      success: true,
      url: result.Location,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};