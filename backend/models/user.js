import mongoose from "mongoose";

const User = mongoose.model("User", {
  fullname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default User;
