import express from "express";
import * as remoteController from "../controllers/remoteController.js";

const remoteRouter = express.Router();

remoteRouter.post("/submit", remoteController.submitRemoteJob);

export default remoteRouter;
