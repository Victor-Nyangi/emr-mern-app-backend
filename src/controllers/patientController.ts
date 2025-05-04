import { Request, Response } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient/Patient";
import Policy from "../models/Insurance/Policy";
import Appointment from "../models/Patient/Appointment";
import ClinicalNote from "../models/Patient/ClinicalNote";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all patients
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single patient
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a patient
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      address,
      phone_number,
      email,
      date_of_birth,
      gender,
      emergency_contact,
      salutation,
      blood_group,
      allergies,
      underlying_conditions,
      medications,
      is_active,
    } = req.body;

    const newPatient = new Patient({
      first_name,
      last_name,
      address,
      phone_number,
      email,
      date_of_birth,
      gender,
      emergency_contact,
      salutation,
      blood_group,
      allergies,
      underlying_conditions,
      medications,
      is_active,
    });

    const savedPatient = await newPatient.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a patient
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No patient with id: ${id}`);

    const data = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      ...data,
      _id: id,
    };

    const updatedPatient = await Patient.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedPatient) res.status(404).json({ message: "Patient not found" });

    res.json(updatedPatient);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a patient
export const deletePatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a patient's policies
export const getPoliciesByPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policies = await Policy.find({
      patientId: req.params.patientId,
    }).populate([
      {
        path: "patientId",
        select: "first_name last_name _id",
      },
      {
        path: "benefitPlanId",
        select: "name _id",
        populate: {
          path: "insurerId",
          select: "name _id",
        },
      },
    ]);

    res.status(200).json(policies);
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a patient's clinical Notes
export const getClinicalNotesByPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notes = await ClinicalNote.find({
      patient_id: req.params.patientId,
    }).populate([
      {
        path: "patient_id",
        select: "first_name last_name _id",
      },
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
    ]);

    res.status(200).json(notes);
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a patient's appointments
export const getAppointmentsByPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await Appointment.find({
      patient_id: req.params.patientId,
    }).populate([
      {
        path: "patient_id",
        select: "first_name last_name _id",
      },
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
    ]);

    res.status(200).json(appointments);
  } catch (error) {
    handleError(res, error, 500);
  }
};
