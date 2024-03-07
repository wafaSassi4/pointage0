import express, { json } from "express";
import crypto from "crypto";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import sendAccountInfo from "../helpers/sendEmail.js";
import { InhashData, hashData } from "../helpers/bcrypt.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404).json({ message: "all field are required!" });
  }

  try {
    const foundedUser = await User.findOne({ email });
    console.log(foundedUser);

    if (foundedUser) {
      const validPassword = await InhashData(password, foundedUser.password);

      if (!validPassword) {
        return res.status(404).json({ message: "Password incorrect" });
      }
      
      res
        .status(200)
        .json({ email: foundedUser.email, fullname: foundedUser.fullname });
    } else {
      res.status(404).json({ message: "Email incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const rhAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required!" });
  }

  const password = crypto.randomBytes(20).toString("hex");
  const cryptedPassword = await hashData(password);

  try {
    const user = await User.create({
      email,
      password: cryptedPassword,
    });

    if (user) {
      console.log(user);
    }

    sendAccountInfo(email, password);
    res.status(201).json({ message: "account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { login, rhAccount };
