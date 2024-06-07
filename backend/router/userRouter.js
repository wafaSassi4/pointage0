import express from "express";
const userRouter = express.Router();
import * as userController from "../controllers/userController.js";
import * as editPasswordController from "../controllers/editPassword.js";
import * as editName from "../controllers/editName.js"
import * as logoutController from "../controllers/logoutController.js"

userRouter.post("/account", userController.rhAccount);
userRouter.post("/login", userController.login);
userRouter.post("/ajouterEmploye", userController.ajouterEmploye);
userRouter.delete("/supprimerEmploye", userController.supprimerEmploye);
userRouter.put("/editPassword", editPasswordController.editPassword);
userRouter.put("/edit-name", editName.editName);
userRouter.post("/logout", logoutController.logout);
userRouter.get("/getUserEmail", userController.getUserEmail);
userRouter.post("/forget-password", userController.ForgetPassword);

userRouter.put("/edit-password", editPasswordController.editPassword)
export default userRouter;