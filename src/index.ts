import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conn from "./db/conn";

// * Imports routes
import registerUser from "./routes/auth/registerUser";
import loginUser from "./routes/auth/loginUser";
import getUserByID from "./routes/user/getUserByID";
import createPost from "./routes/post/createPost";

// * Express
const app = express();

// * Middlewares
app.use(cors());
app.use(express.json());
dotenv.config();

// * DB Connection
conn();

// * Constants
const PORT = process.env.PORT || 3000;

// ** Routes
app.get("/", (_req, res) => {
  return res.status(200).json({ msg: "Hello World" });
});

// * Auth Routes
app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);

// * User Routes
app.get("/user/:id", getUserByID);

// * Post Routes
app.post("/post", createPost);

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
