import express from "express";
import remoteController from "../controllers/remoteController.js";

const remoteRouter = express.Router();

remoteRouter.post("/submit", remoteController.submitRemoteJob);

export default remoteRouter;
