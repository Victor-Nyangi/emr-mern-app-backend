import {
  create,
  single,
  deleteAppointment,
  getAll,
  update,
} from "../../controllers/appointmentsController";
import { Router } from "express";

const router = Router();

// Retrieve all appointments
router.get("/", getAll);

// Create a new appointment
router.post("/", create);

// Retrieve a single appointment with id
router.get("/:id", single);

// Update a appointment with id
router.patch("/:id", update);

// Delete a appointment with id
router.delete("/:id", deleteAppointment);

export default router;
