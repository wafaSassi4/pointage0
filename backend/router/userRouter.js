import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController.js";
import * as editPasswordController from "../controllers/editPassword.js";

userRouter.post("/account", userController.rhAccount);
userRouter.post("/login", userController.login);
userRouter.post("/forget-password", userController.ForgetPassword);
userRouter.put("/edit-password", editPasswordController.editPassword);

export default userRouter;