import express from "express";
import User from "../models/user.js";
import { hashData } from "../helpers/bcrypt.js";
import sendEmail from "../helpers/sendEmail.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const foundedUser = await User.findOne({ email });

    if (!foundedUser) {
      return res.status(404).json({ message: "Email incorrect" });
    }

    const validPassword = await hashData(password, foundedUser.password);

    if (!validPassword) {
      return res.status(404).json({ message: "Password incorrect" });
    }

    res
      .status(200)
      .json({ email: foundedUser.email, fullname: foundedUser.fullname });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rhAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  const passwordLength = 12; // Custom password length
  const password = generatePassword(passwordLength);
  const cryptedPassword = await hashData(password);

  try {
    const user = await User.create({ email, password: cryptedPassword });

    if (!user) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    sendEmail.sendAccountInfo(email, password);
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export { login, rhAccount };
