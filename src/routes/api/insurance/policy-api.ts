import {
  create,
  single,
  deletePolicy,
  getAll,
  update,
} from "../../../controllers/insurance/policyController";
import { Router } from "express";

const router = Router();

// Retrieve all policies
router.get("/", getAll);

// Create a new policy
router.post("/", create);

// Retrieve a single policy with id
router.get("/:id", single);

// Update a policy with id
router.patch("/:id", update);

// Delete a policy with id
router.delete("/:id", deletePolicy);

export default router;
