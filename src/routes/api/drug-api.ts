import { Router } from "express";

import {
  create,
  getAll,
  single,
  update,
  deleteDrug,
} from "../../controllers/drugController";
const router = Router();
// Retrieve all drugs
router.get("/", getAll);

// Create a new drug
router.post("/", create);

// Retrieve a single drug with id
router.get("/:id", single);

// Update a drug with id
router.patch("/:id", update);

// Delete a drug with id
router.delete("/:id", deleteDrug);

export default router;
