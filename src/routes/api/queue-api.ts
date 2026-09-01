import { Router } from "express";
import {
  create,
  getAll,
  update,
  single,
  deleteQueue,
} from "../../controllers/queueController";
import { protect } from "../../middleware/authMiddleware";
import {
  requireAppointmentRead,
  requireAppointmentWrite,
  requireAppointmentCreate,
  requireAppointmentDelete,
} from "../../middleware/authorizationMiddleware";
import { validate } from "../../middleware/validate";
import { createQueueSchema, updateQueueSchema } from "../../schemas";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all queues
router.get("/", requireAppointmentRead, getAll);

// Create a new queue
router.post("/", requireAppointmentCreate, validate(createQueueSchema), create);

// Retrieve a single queue with id
router.get("/:id", requireAppointmentRead, single);

// Update a queue with id
router.patch(
  "/:id",
  requireAppointmentWrite,
  validate(updateQueueSchema),
  update,
);

// Delete a queue with id.
//
// This was a second `router.patch("/:id", ...)`, which Express never
// reached -- the update handler above matches first, so deleteQueue was
// unreachable and queues could not be deleted at all. The controller
// does findByIdAndDelete, so DELETE is the honest verb and matches every
// other router here. No frontend code calls it, so nothing breaks.
router.delete("/:id", requireAppointmentDelete, deleteQueue);

export default router;
