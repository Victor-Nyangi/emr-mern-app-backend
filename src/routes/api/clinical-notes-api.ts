import {
  create,
  single,
  deleteClinicalNote,
  getAll,
  update,
} from "../../controllers/clinicalNotesController";
import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
} from "../../middleware/authorizationMiddleware";

import { validate } from "../../middleware/validate";
import {
  createClinicalNoteSchema,
  updateClinicalNoteSchema,
} from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all clinicalNotes
router.get("/", requireClinicalNotesRead, getAll);

// Create a new clinicalNote
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createClinicalNoteSchema),
  create,
);

// Retrieve a single clinicalNote with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a clinicalNote with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateClinicalNoteSchema),
  update,
);

// Delete a clinicalNote with id
router.delete("/:id", requireClinicalNotesDelete, deleteClinicalNote);

export default router;
