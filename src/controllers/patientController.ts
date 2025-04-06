import { Request, Response } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient";

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
      marital_status,
      education_level,
      income_level,
      occupation,
      size_of_family,
      emergency_contact,
      salutation,
      height,
      weight,
      blood_group,
      allergies,
      underlying_conditions,
      insurance,
      medications,
      updated_date,
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
      marital_status,
      education_level,
      income_level,
      occupation,
      size_of_family,
      emergency_contact,
      salutation,
      height,
      weight,
      blood_group,
      allergies,
      underlying_conditions,
      insurance,
      medications,
      updated_date,
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

    const {
      first_name,
      last_name,
      address,
      phone_number,
      email,
      date_of_birth,
      gender,
      marital_status,
      education_level,
      income_level,
      occupation,
      size_of_family,
      emergency_contact,
      salutation,
      height,
      weight,
      blood_group,
      allergies,
      underlying_conditions,
      insurance,
      medications,
      updated_date,
      is_active,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      first_name,
      last_name,
      address,
      phone_number,
      email,
      date_of_birth,
      gender,
      marital_status,
      education_level,
      income_level,
      occupation,
      size_of_family,
      emergency_contact,
      salutation,
      height,
      weight,
      blood_group,
      allergies,
      underlying_conditions,
      insurance,
      medications,
      updated_date,
      is_active,
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
