const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./configure/dbconnect");
const { inngest, functions } = require("./inngest/index");
const { serve } = require("inngest/express");
const { clerkMiddleware } = require("@clerk/express");
const route = require("./routes/userRouter");

const port = process.env.PORT;
const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", route);
app.get("/", (req, res) => {
  res.send("Welcome to tanbuzz backend");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
