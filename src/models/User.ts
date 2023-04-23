import mongoose from "mongoose";
import { IUser } from "types/types";

const UserSchema = new mongoose.Schema<IUser>({
  name: String,
  nickname: String,
  email: String,
  password: String,
  admin: Boolean,
  avatar: String,
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
