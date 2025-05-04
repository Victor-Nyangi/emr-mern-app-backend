import {
  create,
  single,
  deleteVital,
  getAll,
  update,
  getVitalsByPatient,
  getVitalsByVisit,
} from "../../controllers/vitalController";
import { Router } from "express";

const router = Router();

// Retrieve all vitals
router.get("/", getAll);

// Create a new vital
router.post("/", create);

// Retrieve a single vital with id
router.get("/:id", single);

// Update a vital with id
router.patch("/:id", update);

// Delete a vital with id
router.delete("/:id", deleteVital);

// Fetch a patient's vitals
router.get("/patient/:patientId", getVitalsByPatient);

// Fetch vitals by visit id
router.get("/visit/:visitId", getVitalsByVisit);

export default router;
