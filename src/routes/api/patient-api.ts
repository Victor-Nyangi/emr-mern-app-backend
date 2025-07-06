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
import { protect } from "../../middleware/authMiddleware";
import {
  requirePatientRead,
  requirePatientWrite,
  requirePatientCreate,
  requirePatientDelete,
} from "../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all patients
router.get("/", requirePatientRead, getAll);

// Create a new patient
router.post("/", requirePatientCreate, create);

// Retrieve a single patient with id
router.get("/:id", requirePatientRead, single);

// Update a patient with id
router.patch("/:id", requirePatientWrite, update);

// Delete a patient with id
router.delete("/:id", requirePatientDelete, deletePatient);

// Get policies for a specific patient
router.get("/:patientId/policies", requirePatientRead, getPoliciesByPatient);

// Get appointments for a specific patient
router.get("/:patientId/appointments", requirePatientRead, getAppointmentsByPatient);

// Get clinical notes for a specific patient
router.get("/:patientId/clinical-notes", requirePatientRead, getClinicalNotesByPatient);

export default router;
