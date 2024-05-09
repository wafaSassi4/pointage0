import express from "express";
import * as congeController from "../controllers/congeController.js";


const congeRouter = express.Router();

congeRouter.post("/demande-conge", congeController.createConge);
congeRouter.put("/modifier-conge", congeController.modifierConge);
congeRouter.delete("/supprimer-conge", congeController.supprimerConge);


export default congeRouter;