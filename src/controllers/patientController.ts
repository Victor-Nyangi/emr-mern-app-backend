import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Patient from "../models/Patient/Patient";
import Policy from "../models/Insurance/Policy";
import Appointment from "../models/Patient/Appointment";
import ClinicalNote from "../models/Patient/ClinicalNote";

// Get all patients
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const patients = await Patient.find();

    res.status(200).json(patients);
  },
);

// Get a single patient
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error("Patient not found");
    }

    res.status(200).json(patient);
  },
);

// Create a patient
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

// Update a patient
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // _id is deliberately not taken from the body: spreading it in let a
    // caller attempt to rewrite the document's identity.
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) {
      res.status(404);
      throw new Error("Patient not found");
    }

    res.json(updatedPatient);
  },
);

// Delete a patient
export const deletePatient = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      res.status(404);
      throw new Error("Patient not found");
    }

    res.json({ message: "Patient deleted successfully" });
  },
);

// Fetch a patient's policies
export const getPoliciesByPatient = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

// Fetch a patient's clinical Notes
export const getClinicalNotesByPatient = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

// Fetch a patient's appointments
export const getAppointmentsByPatient = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);
