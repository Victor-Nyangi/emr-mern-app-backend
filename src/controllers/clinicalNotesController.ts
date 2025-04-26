import { Request, Response } from "express";
import mongoose from "mongoose";
import ClinicalNotes from "../models/ClinicalNotes";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all clinicalNotes
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const clinicalNotes = await ClinicalNotes.find();
    res.status(200).json(clinicalNotes);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single clinicalNote
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const clinicalNote = await ClinicalNotes.findById(req.params.id);
    if (!clinicalNote) res.status(404).json({ message: "ClinicalNotes not found" });
    res.status(200).json(clinicalNote);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a clinicalNote
export const create = async (req: Request, res: Response): Promise<void> => {
  const { patient_id, medicalProvider_id, content } =
    req.body;

  try {
    const newClinicalNotes = new ClinicalNotes({
      patient_id,
      medicalProvider_id,
      content
    });

    const savedClinicalNotes = await newClinicalNotes.save();

    res.status(201).json(savedClinicalNotes);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update clinicalNote
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const { patient_id, medicalProvider_id, content} =
      req.body;
    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      patient_id,
      medicalProvider_id,
      content,
      _id: id,
    };

    const updatedClinicalNotes = await ClinicalNotes.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedClinicalNotes) res.status(404).json({ message: "ClinicalNotes not found" });

    res.json(updatedClinicalNotes);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a clinicalNote
export const deleteClinicalNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedClinicalNotes = await ClinicalNotes.findByIdAndDelete(id);
    if (!deletedClinicalNotes) res.status(404).json({ message: "ClinicalNotes not found" });

    res.json({ message: "ClinicalNotes deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
