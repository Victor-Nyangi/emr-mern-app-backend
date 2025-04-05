import { Router } from "express";
import {
  create,
  getAll,
  update,
  single,
  cancelVisit,
} from "../../controllers/visitController";

const router = Router();
// Retrieve all visits
router.get("/", getAll);

// Create a new visit
router.post("/", create);

// Retrieve a single visit with id
router.get("/:id", single);

// Update a visit with id
router.patch("/:id", update);

// Cancel a visit with id
router.patch("/:id", cancelVisit);

export default router;
