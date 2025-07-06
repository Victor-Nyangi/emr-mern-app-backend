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
router.delete("/:id", requireClinicalNotesDelete, deleteClinicalNote);

export default router;
