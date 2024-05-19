import {
  sendAccountInfo,
  sendPasswordReset,
  sendPasswordResetLink,
} from "../helpers/sendEmail.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { hashData, InhashData } from "../helpers/bcrypt.js";
import createToken from "../helpers/createToken.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const foundedUser = await User.findOne({ email });

    if (!foundedUser) {
      return res.status(404).json({ message: "Email incorrect" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      foundedUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).send({ error: "Invalid login credentials" });
    }

    const token = createToken(foundedUser._id, foundedUser.fullname);

    res
      .status(200)
      .json({
        token,
        _id: foundedUser._id,
        email: foundedUser.email,
        fullname: foundedUser.fullname,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rhAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required!" });
  }

  try {
    const foundedUser = await User.findOne({ email });

    if (foundedUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordLength = 12; // Longueur personnalisée du mot de passe
    const password = generatePassword(passwordLength); // Générer un mot de passe aléatoire
    const cryptedPassword = await hashData(password);

    const user = await User.create({
      email,
      password: cryptedPassword,
    });

    if (user) {
      console.log(user);
      sendAccountInfo(email, password);
    }

    res.status(201).json({ message: "account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  try {
    const foundedUser = await User.findOne({ email });

    if (!foundedUser) {
      return res.status(404).json({ message: "Email not found" });
    }

    const passwordLength = 12; // Longueur personnalisée du mot de passe
    const password = generatePassword(passwordLength); // Générer un mot de passe aléatoire
    const cryptedPassword = await hashData(password);

    foundedUser.password = cryptedPassword;
    await foundedUser.save();

    sendPasswordReset(email, password);

    res.status(201).json({ message: "Password reset successfully" });
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

export { login, rhAccount, ForgetPassword};
