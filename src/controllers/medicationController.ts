import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Medication from "../models/Visit/Medication";
import mongoose from "mongoose";
import { VisitMedication } from "interfaces/Visit";

// Get all medications
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const medications = await Medication.find();
    res.status(200).json(medications);
  },
);

// Get a single medication
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      res.status(404);
      throw new Error("Medication not found");
    }
    res.status(200).json(medication);
  },
);

export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No medication with id: ${id}`);
    }

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
    if (!updatedMedication) {
      res.status(404);
      throw new Error("Medication not found");
    }

    res.json(updatedMedication);
  },
);

// Delete a medication
export const deleteMedication = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedMedication = await Medication.findByIdAndDelete(id);
    if (!deletedMedication) {
      res.status(404);
      throw new Error("Medication not found");
    }

    res.json({ message: "Medication deleted successfully" });
  },
);

// Fetch a visit's medications
export const getMedicationsByPatient = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const medications = await Medication.find(
      {
        patientId: req.params.patientId,
      },
      "dosage medication frequency startDate endDate status duration prescribedBy notes visitId",
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(medications);
  },
);

// Fetch a visit's medications
export const getMedicationsByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const medications: VisitMedication[] = await Medication.find(
      {
        visitId: req.params.visitId,
      },
      "dosage medication frequency startDate endDate status duration prescribedBy notes patientId createdAt",
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
  },
);
