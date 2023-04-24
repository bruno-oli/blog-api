import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";

const routers = Router();

routers.post("/auth/login", async (req, res) => {
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
    return res
      .status(200)
      .json({ msg: "User logged in", token, userId: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Um erro inesperado foi encontrado, tente novamente mais tarde!",
    });
  }
});

export default routers;
