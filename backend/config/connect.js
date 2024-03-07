import mongoose from "mongoose";

const db_url = "mongodb://127.0.0.1:27017/addr_mdp";

const Connect_DB = async () => {
  try {
    const db = await mongoose.connect(db_url);
    console.log("Connected to the database");
    return db
  } catch (error) {
    console.log("Failed to connect db =>", error.message);
  }
};

export default Connect_DB;