import { Request, Response } from "express";
import mongoose from "mongoose";
import Vital from "../models/Vital";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all vitals
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const vitals = await Vital.find();
    res.status(200).json(vitals);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single vital
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const vital = await Vital.findById(req.params.id);
    if (!vital) res.status(404).json({ message: "Vital not found" });
    res.status(200).json(vital);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const create = async (req: Request, res: Response) => {
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

  try {
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

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No vital with id: ${id}`);

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
    if (!updatedVital) res.status(404).json({ message: "Vital not found" });

    res.json(updatedVital);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a vital
export const deleteVital = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedVital = await Vital.findByIdAndDelete(id);
    if (!deletedVital) res.status(404).json({ message: "Vital not found" });

    res.json({ message: "Vital deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a patient's vitals
export const getVitalsByPatient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vitals = await Vital.find({
      patient_id: req.params.patientId,
    }).populate([
      {
        path: "patient_id",
        select: "first_name last_name _id",
      },
    ]);

    res.status(200).json(vitals);
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's vitals
export const getVitalsByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vitals = await Vital.findOne(
      {
        visit_id: req.params.visitId,
      },
      "body_temperature pulse_rate respiration_rate blood_pressure blood_glucose overall_status weight health_status"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(vitals);
  } catch (error) {
    handleError(res, error, 500);
  }
};
