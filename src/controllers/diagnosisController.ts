import { Request, Response } from "express";
import Diagnosis from "../models/Visit/Diagnosis";
import mongoose from "mongoose";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all diagnoses
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const diagnoses = await Diagnosis.find();
    res.status(200).json(diagnoses);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single diagnosis
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) res.status(404).json({ message: "Diagnosis not found" });
    res.status(200).json(diagnosis);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const create = async (req: Request, res: Response) => {
  const {
    diagnosis,
    visit_id,
    code,
    type,
    date,
    status,
    medicalProvider_id,
    notes,
  } = req.body;

  try {
    const newDiagnosis = new Diagnosis({
      diagnosis,
      visit_id,
      code,
      type,
      date,
      status,
      medicalProvider_id,
      notes,
    });

    const savedDiagnosis = await newDiagnosis.save();
    res.status(201).json(savedDiagnosis);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const {
      diagnosis,
      visit_id,
      code,
      type,
      date,
      status,
      medicalProvider_id,
      notes,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No diagnosis with id: ${id}`);

    const payload = {
      diagnosis,
      visit_id,
      code,
      type,
      date,
      status,
      medicalProvider_id,
      notes,
      _id: id,
    };

    const updatedDiagnosis = await Diagnosis.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedDiagnosis)
      res.status(404).json({ message: "Diagnosis not found" });

    res.json(updatedDiagnosis);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a diagnosis
export const deleteDiagnosis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedDiagnosis = await Diagnosis.findByIdAndDelete(id);
    if (!deletedDiagnosis)
      res.status(404).json({ message: "Diagnosis not found" });

    res.json({ message: "Diagnosis deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's diagnoses
export const getDiagnosesByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const diagnoses = await Diagnosis.find(
      {
        visit_id: req.params.visitId,
      },
      "code diagnosis type date status medicalProvider_id notes"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(diagnoses);
  } catch (error) {
    handleError(res, error, 500);
  }
};
