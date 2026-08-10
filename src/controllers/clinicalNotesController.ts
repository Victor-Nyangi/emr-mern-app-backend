import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ClinicalNote from "../models/Patient/ClinicalNote";
import mongoose from "mongoose";

// Get all clinicalNotes
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

// Get a single clinicalNote
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
    if (!clinicalNote) {
      res.status(404);
      throw new Error("ClinicalNote not found");
    }
    res.status(200).json(clinicalNote);
  },
);

// Create a clinicalNote
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { patient_id, medicalProvider_id, content } = req.body;

    const newClinicalNote = new ClinicalNote({
      patient_id,
      medicalProvider_id,
      content,
    });

    const savedClinicalNote = await newClinicalNote.save();

    res.status(201).json(savedClinicalNote);
  },
);

// Update clinicalNote
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const { patient_id, medicalProvider_id, content } = req.body;

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
      },
    );
    if (!updatedClinicalNote) {
      res.status(404);
      throw new Error("ClinicalNote not found");
    }

    res.json(updatedClinicalNote);
  },
);

// Delete a clinicalNote
export const deleteClinicalNote = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedClinicalNote = await ClinicalNote.findByIdAndDelete(id);
    if (!deletedClinicalNote) {
      res.status(404);
      throw new Error("ClinicalNote not found");
    }

    res.json({ message: "ClinicalNote deleted successfully" });
  },
);
