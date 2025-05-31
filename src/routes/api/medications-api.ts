import {
  create,
  single,
  deleteMedication,
  getAll,
  update,
  getMedicationsByVisit,
  getMedicationsByPatient,
} from "../../controllers/medicationController";

import { Router } from "express";

const router = Router();

// Retrieve all medications
router.get("/", getAll);

// Create a new medication
router.post("/", create);

// Retrieve a single medication with id
router.get("/:id", single);

// Update a medication with id
router.patch("/:id", update);

// Delete a medication with id
router.delete("/:id", deleteMedication);

// Fetch medication by visit id
router.get("/visit/:visitId", getMedicationsByVisit);

// Fetch medication by patient id
router.get("/patient/:patientId", getMedicationsByPatient);

export default router;
