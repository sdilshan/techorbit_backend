import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const server = express();
const PORT = 3000;

mongoose
  .connect(process.env.DB_LOCATION)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});