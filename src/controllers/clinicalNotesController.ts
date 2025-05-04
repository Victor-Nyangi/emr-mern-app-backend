import { Request, Response } from "express";
import ClinicalNote from "../models/Patient/ClinicalNote";
import mongoose from "mongoose";

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
    const clinicalNotes = await ClinicalNote.find({}).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
      {
        path: "patient_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    res.status(200).json(clinicalNotes);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single clinicalNote
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const clinicalNote = await ClinicalNote.findById(req.params.id).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
      {
        path: "patient_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    if (!clinicalNote)
      res.status(404).json({ message: "ClinicalNote not found" });
    res.status(200).json(clinicalNote);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a clinicalNote
export const create = async (req: Request, res: Response): Promise<void> => {
  const { patient_id, medicalProvider_id, content } = req.body;

  try {
    const newClinicalNote = new ClinicalNote({
      patient_id,
      medicalProvider_id,
      content,
    });

    const savedClinicalNote = await newClinicalNote.save();

    res.status(201).json(savedClinicalNote);
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

    const { patient_id, medicalProvider_id, content } = req.body;
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

    const updatedClinicalNote = await ClinicalNote.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      }
    );
    if (!updatedClinicalNote)
      res.status(404).json({ message: "ClinicalNote not found" });

    res.json(updatedClinicalNote);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a clinicalNote
export const deleteClinicalNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedClinicalNote = await ClinicalNote.findByIdAndDelete(id);
    if (!deletedClinicalNote)
      res.status(404).json({ message: "ClinicalNote not found" });

    res.json({ message: "ClinicalNote deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
