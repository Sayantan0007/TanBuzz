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
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy forbids access from ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
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
