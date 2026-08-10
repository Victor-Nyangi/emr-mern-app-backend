import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import VisitClinicalNote from "../../models/Visit/VisitClinicalNote";
import mongoose from "mongoose";

// Get all clinicalNotes
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const clinicalNotes = await VisitClinicalNote.find({}).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    res.status(200).json(clinicalNotes);
  },
);

// Get a single clinicalNote
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const clinicalNote = await VisitClinicalNote.findById(
      req.params.id,
    ).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    if (!clinicalNote) {
      res.status(404);
      throw new Error("VisitClinicalNote not found");
    }
    res.status(200).json(clinicalNote);
  },
);

// Create a clinicalNote
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { visit_id, medicalProvider_id, content, assessment, plan } =
      req.body;

    const newVisitClinicalNote = new VisitClinicalNote({
      visit_id,
      medicalProvider_id,
      content,
      assessment,
      plan,
    });

    const savedVisitClinicalNote = await newVisitClinicalNote.save();

    res.status(201).json(savedVisitClinicalNote);
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

    const { visit_id, medicalProvider_id, content, assessment, plan } =
      req.body;

    const payload = {
      visit_id,
      medicalProvider_id,
      content,
      assessment,
      plan,
      _id: id,
    };

    const updatedVisitClinicalNote = await VisitClinicalNote.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      },
    );
    if (!updatedVisitClinicalNote) {
      res.status(404);
      throw new Error("VisitClinicalNote not found");
    }

    res.json(updatedVisitClinicalNote);
  },
);

// Delete a clinicalNote
export const deleteVisitClinicalNote = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedVisitClinicalNote =
      await VisitClinicalNote.findByIdAndDelete(id);
    if (!deletedVisitClinicalNote) {
      res.status(404);
      throw new Error("VisitClinicalNote not found");
    }

    res.json({ message: "VisitClinicalNote deleted successfully" });
  },
);

// Fetch a visit's clinical notes
export const getClinicalNotesByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const diagnoses = await VisitClinicalNote.find(
      {
        visit_id: req.params.visitId,
      },
      "assessment plan content medicalProvider_id createdAt",
    )
      .populate([
        {
          path: "medicalProvider_id",
          select: "first_name last_name salutation _id",
        },
      ])
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(diagnoses);
  },
);
