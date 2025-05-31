import {
  create,
  single,
  getAll,
  update,
  deleteVisitClinicalNote,
  getClinicalNotesByVisit,
} from "../../../controllers/visit/visitClinicalNotesController";

import { Router } from "express";

const router = Router();

// Retrieve all clinicalNotes
router.get("/", getAll);

// Create a new clinicalNote
router.post("/", create);

// Retrieve a single clinicalNote with id
router.get("/:id", single);

// Update a clinicalNote with id
router.patch("/:id", update);

// Delete a clinicalNote with id
router.delete("/:id", deleteVisitClinicalNote);

// Fetch diagnosis by visit id
router.get("/visit/:visitId", getClinicalNotesByVisit);
export default router;
