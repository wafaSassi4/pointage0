import express from "express"
const userRouter  = express.Router();
import * as userController from "../controllers/userController.js";

userRouter.post("/account", userController.rhAccount );
userRouter.post("/login", userController.login );

export default userRouter;