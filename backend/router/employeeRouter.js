import express from "express";
const router = express.Router();

import {
  createEmployee,
  getFullname,
  createEntry,
  updateExitTimeAndHoursWorked,
  getEmployeesPresentiel,
  getEmployeesRemote,
  getAllEmployees,
  getActiveEmployee,
} from "../controllers/employeeController.js";


router.post("/createEmployee", createEmployee);
router.post("/createEntry", createEntry);
router.patch("/updateExitTimeAndHoursWorked/:id", updateExitTimeAndHoursWorked);
router.get("/presentiel", getEmployeesPresentiel);
router.get("/remote", getEmployeesRemote);
router.get("/getFullname", getFullname);
router.get("/getAllEmployees", getAllEmployees); // Nouvelle route pour récupérer tous les employés
router.post("/getActiveEmployee", getActiveEmployee); 



export default router;