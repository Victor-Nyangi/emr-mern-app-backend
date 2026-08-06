import { Request, Response } from "express";
import Medication from "../models/Visit/Medication";
import mongoose from "mongoose";
import { VisitMedication } from "interfaces/Visit";

import { handleError } from "../utils/handleError";

// Get all medications
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single medication
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) res.status(404).json({ message: "Medication not found" });
    res.status(200).json(medication);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const create = async (req: Request, res: Response) => {
  const {
    medication,
    visitId,
    patientId,
    dosage,
    frequency,
    startDate,
    endDate,
    status,
    duration,
    prescribedBy,
    notes,
  } = req.body;

  try {
    const newMedication = new Medication({
      medication,
      visitId,
      patientId,
      dosage,
      frequency,
      startDate,
      endDate,
      status,
      duration,
      prescribedBy,
      notes,
    });

    const savedMedication = await newMedication.save();
    res.status(201).json(savedMedication);
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
      medication,
      dosage,
      frequency,
      startDate,
      endDate,
      status,
      duration,
      prescribedBy,
      notes,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No medication with id: ${id}`);

    const payload = {
      medication,
      dosage,
      frequency,
      startDate,
      endDate,
      status,
      duration,
      prescribedBy,
      notes,
      _id: id,
    };

    const updatedMedication = await Medication.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedMedication)
      res.status(404).json({ message: "Medication not found" });

    res.json(updatedMedication);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a medication
export const deleteMedication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedMedication = await Medication.findByIdAndDelete(id);
    if (!deletedMedication)
      res.status(404).json({ message: "Medication not found" });

    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's medications
export const getMedicationsByPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const medications = await Medication.find(
      {
        patientId: req.params.patientId,
      },
      "dosage medication frequency startDate endDate status duration prescribedBy notes visitId"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(medications);
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's medications
export const getMedicationsByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const medications: VisitMedication[] = await Medication.find(
      {
        visitId: req.params.visitId,
      },
      "dosage medication frequency startDate endDate status duration prescribedBy notes patientId createdAt"
    )
      .populate([
        {
          path: "prescribedBy",
          select: "first_name last_name salutation _id",
        },
      ])
      .sort({ createdAt: -1 })
      .lean();

    const new_medications = medications.filter((med) => {
      const medCreatedAt = new Date(med.createdAt);
      return medCreatedAt >= oneDayAgo;
    });

    const current_medications = medications.filter((med) => {
      const medCreatedAt = new Date(med.createdAt);
      return medCreatedAt < oneDayAgo;
    });

    // Example return
    res.status(200).json({
      new_medications,
      current_medications,
    });
  } catch (error) {
    handleError(res, error, 500);
  }
};
