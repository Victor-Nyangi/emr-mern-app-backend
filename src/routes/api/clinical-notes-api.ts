import {
  create,
  single,
  deleteClinicalNotes,
  getAll,
  update,
} from "../../controllers/clinicalNotesController";
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
router.delete("/:id", deleteClinicalNotes);

export default router;
