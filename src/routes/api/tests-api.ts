import {
  create,
  single,
  deleteTest,
  getAll,
  update,
  getTestsByVisit,
} from "../../controllers/testsController";

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

// Retrieve all tests
router.get("/", requireClinicalNotesRead, getAll);

// Create a new tests
router.post("/", requireClinicalNotesCreate, create);

// Retrieve a single tests with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a tests with id
router.patch("/:id", requireClinicalNotesWrite, update);

// Delete a tests with id
router.delete("/:id", requireClinicalNotesDelete, deleteTest);

// Fetch tests by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getTestsByVisit);

export default router;
