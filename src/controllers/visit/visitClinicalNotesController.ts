import { Request, Response } from "express";
import VisitClinicalNote from "../../models/Visit/VisitClinicalNote";
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
    const clinicalNotes = await VisitClinicalNote.find({}).populate([
      {
        path: "medicalProvider_id",
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
    const clinicalNote = await VisitClinicalNote.findById(
      req.params.id
    ).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    if (!clinicalNote)
      res.status(404).json({ message: "VisitClinicalNote not found" });
    res.status(200).json(clinicalNote);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a clinicalNote
export const create = async (req: Request, res: Response): Promise<void> => {
  const { visit_id, medicalProvider_id, content, assessment, plan } = req.body;

  try {
    const newVisitClinicalNote = new VisitClinicalNote({
      visit_id,
      medicalProvider_id,
      content,
      assessment,
      plan,
    });

    const savedVisitClinicalNote = await newVisitClinicalNote.save();

    res.status(201).json(savedVisitClinicalNote);
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

    const { visit_id, medicalProvider_id, content, assessment, plan } =
      req.body;
    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

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
      }
    );
    if (!updatedVisitClinicalNote)
      res.status(404).json({ message: "VisitClinicalNote not found" });

    res.json(updatedVisitClinicalNote);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a clinicalNote
export const deleteVisitClinicalNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedVisitClinicalNote = await VisitClinicalNote.findByIdAndDelete(
      id
    );
    if (!deletedVisitClinicalNote)
      res.status(404).json({ message: "VisitClinicalNote not found" });

    res.json({ message: "VisitClinicalNote deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's clinical notes
export const getClinicalNotesByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const diagnoses = await VisitClinicalNote.find(
      {
        visit_id: req.params.visitId,
      },
      "assessment plan content medicalProvider_id createdAt"
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
  } catch (error) {
    handleError(res, error, 500);
  }
};
