import {
  create,
  single,
  getAll,
  update,
  deleteTreatment,
  getTreatmentsByVisit,
} from "../../../controllers/visit/treatmentController";

import { Router } from "express";

const router = Router();

// Retrieve all clinicalNotes
router.get("/", getAll);

// Create a new clinicalNote
router.post("/", create);

// Retrieve a single clinicalNote with id
router.get("/:id", single);

// Update a treatment with id
router.patch("/:id", update);

// Delete a clinicalNote with id
router.delete("/:id", deleteTreatment);

// Fetch treatment by visit id
router.get("/visit/:visitId", getTreatmentsByVisit);
export default router;
