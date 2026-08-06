import {
  create,
  single,
  deleteAppointment,
  getAll,
  update,
} from "../../controllers/appointmentsController";
import { Router } from "express";
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

// Retrieve all appointments
router.get("/", requireAppointmentRead, getAll);

// Create a new appointment
router.post("/", requireAppointmentCreate, create);

// Retrieve a single appointment with id
router.get("/:id", requireAppointmentRead, single);

// Update a appointment with id
router.patch("/:id", requireAppointmentWrite, update);

// Delete a appointment with id
router.delete("/:id", requireAppointmentDelete, deleteAppointment);

export default router;
