import { Request, Response } from "express";
import mongoose from "mongoose";
import Visit from "../models/Visit";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all visits
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const visits = await Visit.find();

    res.status(200).json(visits);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single visit
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) res.status(404).json({ message: "Visit not found" });
    res.status(200).json(visit);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a visit
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient_id, payment_method, queue } = req.body;

    const newVisit = new Visit({
      patient_id,
      payment_method,
      queue,
      status: "ARRIVED",
      createdAt: new Date(),
    });

    const savedVisit = await newVisit.save();

    res.status(201).json(savedVisit);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a visit
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No visit with id: ${id}`);

    const { patient_id, payment_method, queue, status } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      patient_id,
      payment_method,
      queue,
      status,
      updatedAt: new Date(),
      _id: id,
    };

    const updatedVisit = await Visit.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedVisit) res.status(404).json({ message: "Visit not found" });

    res.json(updatedVisit);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Cancel a visit
export const cancelVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No visit with id: ${id}`);

    const payload = {
      status: "CANCELLED",
      updatedAt: new Date(),
      _id: id,
    };

    const updatedVisit = await Visit.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedVisit) res.status(404).json({ message: "Visit not found" });

    res.json(updatedVisit);
  } catch (error) {
    handleError(res, error, 400);
  }
};
