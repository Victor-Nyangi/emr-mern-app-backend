import {
  create,
  single,
  deleteBilling,
  getAll,
  update,
} from "../../controllers/billingController";
import { Router } from "express";

const router = Router();

// Retrieve all billings
router.get("/", getAll);

// Create a new billing
router.post("/", create);

// Retrieve a single billing with id
router.get("/:id", single);

// Update a billing with id
router.patch("/:id", update);

// Delete a billing with id
router.delete("/:id", deleteBilling);

export default router;
