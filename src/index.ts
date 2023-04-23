import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conn from "./db/conn";

// * Express
const app = express();

// * Middlewares
app.use(cors());
dotenv.config();

// * DB Connection
conn();

// * Constants
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  return res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
