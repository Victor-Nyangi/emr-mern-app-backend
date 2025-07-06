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

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all queues
router.get("/", requireAppointmentRead, getAll);

// Create a new queue
router.post("/", requireAppointmentCreate, create);

// Retrieve a single queue with id
router.get("/:id", requireAppointmentRead, single);

// Update a queue with id
router.patch("/:id", requireAppointmentWrite, update);

// Cancel a queue with id
router.patch("/:id", requireAppointmentDelete, deleteQueue);

export default router;
