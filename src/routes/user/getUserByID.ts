import { Router } from "express";
import User from "../../models/User";
import mongoose from "mongoose";
import checkToken from "../../middlewares/checkToken";

const routes = Router();

routes.get("/user/:id", checkToken, async (req, res) => {
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
    return res.status(500).json({
      msg: "Um erro interno foi encontrado! Tente novamente mais tarde!",
    });
  }
});

export default routes;
