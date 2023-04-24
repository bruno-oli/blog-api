import mongoose from "mongoose";
import { IPost } from "types/types";

const PostSchema = new mongoose.Schema<IPost>({
  title: String,
  description: String,
  body: String,
  category: String,
  image: String,
  createdBy: {
    userId: String,
    name: String,
    avatar: String,
  },
  createdAt: Date,
  updatedAt: Date,
});

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
