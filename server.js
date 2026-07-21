//Fix DNS Server Refuse
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import "dotenv/config";


import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import uploadRoutes from "./routes/upload.route.js";

const server = express();
const PORT = 3000;

// Middleware
server.use(express.json());

mongoose
  .connect(process.env.DB_LOCATION)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

  //Routes
server.use("/api/user", userRoutes);
server.use("/api/", authRoutes);
server.use("/api", uploadRoutes);
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});