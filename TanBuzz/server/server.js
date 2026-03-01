const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./configure/dbconnect");
const { inngest, functions } = require("./inngest/index");
const { serve } = require("inngest/express");
const { clerkMiddleware } = require("@clerk/express");
const userRoute = require("./routes/userRouter");
const postRoute = require("./routes/postRoutes");
const storyRoute = require("./routes/storyRoutes");
const msgRoute = require("./routes/messageRoutes");

const port = process.env.PORT;
const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "https://tan-buzz.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/story", storyRoute);
app.use("/api/message", msgRoute);
app.get("/", (req, res) => {
  res.send("Welcome to tanbuzz backend");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
