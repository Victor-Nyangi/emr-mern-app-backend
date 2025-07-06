import {
  create,
  single,
  getAll,
  update,
  deleteVisitClinicalNote,
  getClinicalNotesByVisit,
} from "../../../controllers/visit/visitClinicalNotesController";

import { Router } from "express";
import { protect } from "../../../middleware/authMiddleware";
import {
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
} from "../../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all clinicalNotes
router.get("/", requireClinicalNotesRead, getAll);

// Create a new clinicalNote
router.post("/", requireClinicalNotesCreate, create);

// Retrieve a single clinicalNote with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a clinicalNote with id
router.patch("/:id", requireClinicalNotesWrite, update);

// Delete a clinicalNote with id
router.delete("/:id", requireClinicalNotesDelete, deleteVisitClinicalNote);

// Fetch clinicalNote by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getClinicalNotesByVisit);
export default router;
