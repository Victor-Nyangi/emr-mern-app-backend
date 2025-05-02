import {
  create,
  single,
  deleteInsurer,
  getAll,
  update,
} from "../../../controllers/insurance/insurerController";
import { Router } from "express";

const router = Router();

// Retrieve all insurance firms
router.get("/", getAll);

// Create a new insurance firm
router.post("/", create);

// Retrieve a single insurance firm with id
router.get("/:id", single);

// Update a insurance firm with id
router.patch("/:id", update);

// Delete a insurance firm with id
router.delete("/:id", deleteInsurer);

export default router;
