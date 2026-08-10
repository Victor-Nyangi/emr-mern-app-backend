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

import { validate } from "../../middleware/validate";
import { createTestSchema, updateTestSchema } from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all tests
router.get("/", requireClinicalNotesRead, getAll);

// Create a new tests
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createTestSchema),
  create,
);

// Retrieve a single tests with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a tests with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateTestSchema),
  update,
);

// Delete a tests with id
router.delete("/:id", requireClinicalNotesDelete, deleteTest);

// Fetch tests by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getTestsByVisit);

export default router;
