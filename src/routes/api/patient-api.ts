import { Router } from "express";
import {
  create,
  getAll,
  update,
  single,
  deletePatient,
  getPoliciesByPatient,
  getClinicalNotesByPatient,
  getAppointmentsByPatient,
} from "../../controllers/patientController";

const router = Router();
// Retrieve all patients
router.get("/", getAll);

// Create a new patient
router.post("/", create);

// Retrieve a single patient with id
router.get("/:id", single);

// Update a patient with id
router.patch("/:id", update);

// Delete a patient with id
router.delete("/:id", deletePatient);

// Get policies for a specific patient
router.get("/:patientId/policies", getPoliciesByPatient);

// Get appoibtments for a specific patient
router.get("/:patientId/appointments", getAppointmentsByPatient);

// Get clinical notes for a specific patient
router.get("/:patientId/clinical-notes", getClinicalNotesByPatient);

export default router;
