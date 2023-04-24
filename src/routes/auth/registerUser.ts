import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";

const routers = Router();

routers.post("/auth/register", async (req, res) => {
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
    posts: [],
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

export default routers;
