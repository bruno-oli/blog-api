import { Router } from "express";
import checkToken from "../../middlewares/checkToken";
import { IPost, IUser } from "../../types/types";
import User from "../../models/User";
import mongoose from "mongoose";
import Post from "../../models/Post";

const routes = Router();

routes.post("/post", checkToken, async (req, res) => {
  const {
    title,
    description,
    category,
    image,
    body,
    createdBy,
  }: Partial<IPost> = req.body;

  if (!title || !description || !category || !image || !body || !createdBy) {
    return res.status(400).json({ msg: "Todos os campos são necessários!" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(createdBy.userId)) {
      return res.status(400).json({ msg: "ID de usuário inválido!" });
    }

    const userData: IUser | null = await User.findById(
      createdBy.userId,
      "-password"
    );

    if (!userData) {
      return res.status(500).json({
        msg: "Esse ID de usuário não existe! Tente novamente mais tarde!",
      });
    }

    if (!userData.admin) {
      return res.status(401).json({ msg: "Usuário não autorizado!" });
    }

    const post = new Post({
      title,
      description,
      category,
      image,
      body,
      createdBy: {
        name: userData.name,
        avatar: userData.avatar,
        userId: createdBy.userId,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await User.updateOne(
      { _id: createdBy.userId },
      {
        $push: {
          posts: {
            _id: post._id,
            title,
            description,
            category,
            image,
          },
        },
      }
    );

    await post.save();

    return res.status(200).json({
      msg: "Post criado com sucesso!",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Um erro interno foi encontrado! Tente novamente mais tarde!",
    });
  }
});

export default routes;
