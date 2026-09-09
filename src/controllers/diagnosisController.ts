import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Diagnosis from "../models/Visit/Diagnosis";
import mongoose from "mongoose";

// Get all diagnoses
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const diagnoses = await Diagnosis.find();
    res.status(200).json(diagnoses);
  },
);

// Get a single diagnosis
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) {
      res.status(404);
      throw new Error("Diagnosis not found");
    }
    res.status(200).json(diagnosis);
  },
);

export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No diagnosis with id: ${id}`);
    }

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
    if (!updatedDiagnosis) {
      res.status(404);
      throw new Error("Diagnosis not found");
    }

    res.json(updatedDiagnosis);
  },
);

// Delete a diagnosis
export const deleteDiagnosis = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedDiagnosis = await Diagnosis.findByIdAndDelete(id);
    if (!deletedDiagnosis) {
      res.status(404);
      throw new Error("Diagnosis not found");
    }

    res.json({ message: "Diagnosis deleted successfully" });
  },
);

// Fetch a visit's diagnoses
export const getDiagnosesByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const diagnoses = await Diagnosis.find(
      {
        visit_id: req.params.visitId,
      },
      "code diagnosis type date status medicalProvider_id notes",
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(diagnoses);
  },
);
