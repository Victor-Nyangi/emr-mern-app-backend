import {
  create,
  single,
  deleteTest,
  getAll,
  update,
  getTestsByVisit,
} from "../../controllers/testsController";

import { Router } from "express";

const router = Router();

// Retrieve all diagnoses
router.get("/", getAll);

// Create a new tests
router.post("/", create);

// Retrieve a single tests with id
router.get("/:id", single);

// Update a tests with id
router.patch("/:id", update);

// Delete a tests with id
router.delete("/:id", deleteTest);

// Fetch tests by visit id
router.get("/visit/:visitId", getTestsByVisit);

export default router;
