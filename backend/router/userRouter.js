import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController.js";
import * as editPasswordController from "../controllers/editPassword.js";
import * as editNameController from "../controllers/editName.js";
import * as logoutController from "../controllers/logoutController.js";

userRouter.post("/account", userController.rhAccount);
userRouter.post("/login", userController.login);
userRouter.post("/forget-password", userController.ForgetPassword);
userRouter.put("/edit-password", editPasswordController.editPassword);
userRouter.put("/edit-name", editNameController.editName);
userRouter.post("/logout", logoutController.logout);

export default userRouter;
