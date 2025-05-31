import {
  create,
  single,
  deleteDiagnosis,
  getAll,
  update,
  getDiagnosesByVisit,
} from "../../controllers/diagnosisController";

import { Router } from "express";

const router = Router();

// Retrieve all diagnoses
router.get("/", getAll);

// Create a new diagnosis
router.post("/", create);

// Retrieve a single diagnosis with id
router.get("/:id", single);

// Update a diagnosis with id
router.patch("/:id", update);

// Delete a diagnosis with id
router.delete("/:id", deleteDiagnosis);

// Fetch diagnosis by visit id
router.get("/visit/:visitId", getDiagnosesByVisit);

export default router;
