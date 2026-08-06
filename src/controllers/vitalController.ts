import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Vital from "../models/Vital";

// Get all vitals
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const vitals = await Vital.find();
    res.status(200).json(vitals);
  },
);

// Get a single vital
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const vital = await Vital.findById(req.params.id);
    if (!vital) {
      res.status(404);
      throw new Error("Vital not found");
    }
    res.status(200).json(vital);
  },
);

export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      patient_id,
      visit_id,
      body_temperature,
      pulse_rate,
      respiration_rate,
      blood_pressure,
      overall_status,
      date_created,
      weight,
      blood_glucose,
      health_status,
    } = req.body;

    const newVital = new Vital({
      patient_id,
      visit_id,
      body_temperature,
      pulse_rate,
      respiration_rate,
      blood_pressure,
      overall_status,
      date_created,
      weight,
      blood_glucose,
      health_status,
    });

    const savedVital = await newVital.save();
    res.status(201).json(savedVital);
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
      body_temperature,
      pulse_rate,
      respiration_rate,
      blood_pressure,
      overall_status,
      date_created,
      weight,
      blood_glucose,
      health_status,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No vital with id: ${id}`);
    }

    const payload = {
      body_temperature,
      pulse_rate,
      respiration_rate,
      blood_pressure,
      overall_status,
      date_created,
      weight,
      blood_glucose,
      health_status,
      _id: id,
    };

    const updatedVital = await Vital.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedVital) {
      res.status(404);
      throw new Error("Vital not found");
    }

    res.json(updatedVital);
  },
);

// Delete a vital
export const deleteVital = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedVital = await Vital.findByIdAndDelete(id);
    if (!deletedVital) {
      res.status(404);
      throw new Error("Vital not found");
    }

    res.json({ message: "Vital deleted successfully" });
  },
);

// Fetch a patient's vitals
export const getVitalsByPatient = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const vitals = await Vital.find({
      patient_id: req.params.patientId,
    }).populate([
      {
        path: "patient_id",
        select: "first_name last_name _id",
      },
    ]);

    res.status(200).json(vitals);
  },
);

// Fetch a visit's vitals
export const getVitalsByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const vitals = await Vital.findOne(
      {
        visit_id: req.params.visitId,
      },
      "body_temperature pulse_rate respiration_rate blood_pressure blood_glucose overall_status weight health_status",
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(vitals);
  },
);
