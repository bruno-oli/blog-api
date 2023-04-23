import mongoose from "mongoose";

const main = async () => {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  try {
    if (dbUser || dbPassword) {
      await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.czdr7kg.mongodb.net/?retryWrites=true&w=majority`
      );
      console.log("✔ Connected to MongoDB");
    }
  } catch {
    console.error("❌ Error connecting to MongoDB");
  }
};

export default main;
