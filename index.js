import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import contactRoute from "./route/contact.route.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.options("*", cors());

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 4000;
const MONGODBURI = process.env.MongoDBURI;

//connect to mongodb
try {
  mongoose.connect(MONGODBURI);
  console.log("Connected to Mongo");
} catch (error) {
  console.log("error connecting to ", error);
}

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "frontend", "dist")));
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/contact", contactRoute);

app.listen(1000, () => {
  console.log(`Server is listening on port ${PORT}`);
});
