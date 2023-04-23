import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conn from "./db/conn";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkToken from "./middlewares/checkToken";

// * Express
const app = express();

// * Middlewares
app.use(cors());
app.use(express.json());
dotenv.config();

// * Models
import User from "./models/User";
import mongoose from "mongoose";

// * DB Connection
conn();

// * Constants
const PORT = process.env.PORT || 3000;

// ** Routes
app.get("/", (_req, res) => {
  return res.status(200).json({ msg: "Hello World" });
});

// * Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de usuário inválido!" });
    }

    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({
        msg: "Um erro interno foi encontrado! Tente novamente mais tarde!",
      });
  }
});

// * Register User
app.post("/auth/register", async (req, res) => {
  const { name, nickname, email, password, avatar } = req.body;

  if (!name || !nickname || !email || !password) {
    return res.status(422).json({ msg: "Todos os campos são obrigatórios!" });
  }

  if (await User.findOne({ email })) {
    return res.status(422).json({ msg: "Esse e-mail já está sendo usado!" });
  }

  if (await User.findOne({ nickname })) {
    return res.status(422).json({ msg: "Esse nickname já está sendo usado!" });
  }

  // * Create Password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    nickname,
    email,
    password: hashedPassword,
    admin: false,
    avatar: avatar
      ? avatar
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  });

  try {
    await newUser.save();
    return res
      .status(201)
      .json({ msg: "User created", userCreated: { name, nickname, email } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Um erro inesperado foi encontrado, tente novamente mais tarde!",
    });
  }
});

// * Login User
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ msg: "Todos os campos são obrigatórios!" });
  }

  // * Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // * Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "O e-mail ou a senha são inválidos!" });
  }

  // * Create JWT
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret || ""
    );
    return res.status(200).json({ msg: "User logged in", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Um erro inesperado foi encontrado, tente novamente mais tarde!",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
