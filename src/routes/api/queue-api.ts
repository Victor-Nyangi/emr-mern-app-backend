import { Router } from "express";
import {
  create,
  getAll,
  update,
  single,
  deleteQueue,
} from "../../controllers/queueController";

const router = Router();
// Retrieve all queues
router.get("/", getAll);

// Create a new queue
router.post("/", create);

// Retrieve a single queue with id
router.get("/:id", single);

// Update a queue with id
router.patch("/:id", update);

// Cancel a queue with id
router.patch("/:id", deleteQueue);

export default router;
