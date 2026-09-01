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

import { validate } from "../../../middleware/validate";
import {
  createVisitClinicalNoteSchema,
  updateVisitClinicalNoteSchema,
} from "../../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all clinicalNotes
router.get("/", requireClinicalNotesRead, getAll);

// Create a new clinicalNote
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createVisitClinicalNoteSchema),
  create,
);

// Retrieve a single clinicalNote with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a clinicalNote with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateVisitClinicalNoteSchema),
  update,
);

// Delete a clinicalNote with id
router.delete("/:id", requireClinicalNotesDelete, deleteVisitClinicalNote);

// Fetch clinicalNote by visit id
router.get(
  "/visit/:visitId",
  requireClinicalNotesRead,
  getClinicalNotesByVisit,
);
export default router;
