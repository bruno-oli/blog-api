import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const secret = process.env.SECRET || "";

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    jwt.verify(token, secret); 
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Um erro interno foi encontrado, tente novamente mais tarde!",
    });
  }
}

export default checkToken;
