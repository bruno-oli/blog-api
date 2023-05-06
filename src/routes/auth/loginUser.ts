import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { LoginUserSchema } from "../../types/types";
import * as z from "zod";

const routers = Router();

routers.post("/auth/login", async (req, res) => {
  
  try {
    LoginUserSchema.parse(req.body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        msg: "Dados inválidos",
        errors: err.errors.map((e) => e.message),
      });
    } else {
      return res.status(500).json({ msg: "Erro interno do servidor" });
    }
  }

  const { email, password } = req.body;

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
      .json({ msg: "Usuário logado com sucesso!", token, userId: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Um erro inesperado foi encontrado, tente novamente mais tarde!",
    });
  }
});

export default routers;
