import { Request, Response } from "express";
import mongoose from "mongoose";
import Drug from "../models/Drug";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all drugs
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const drugs = await Drug.find();
    res.status(200).json(drugs);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single drug
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) res.status(404).json({ message: "Drug not found" });
    res.status(200).json(drug);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a member
export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, description, manufacter_date, expiry_date, updated_date } =
    req.body;

  try {
    const newDrug = new Drug({
      name,
      description,
      manufacter_date,
      expiry_date,
      updated_date,
    });

    const savedDrug = await newDrug.save();

    res.status(201).json(savedDrug);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update drug
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const { name, description, manufacter_date, expiry_date, updated_date } =
      req.body;
    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      name,
      description,
      manufacter_date,
      expiry_date,
      updated_date,
      _id: id,
    };

    const updatedDrug = await Drug.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedDrug) res.status(404).json({ message: "Drug not found" });

    res.json(updatedDrug);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a drug
export const deleteDrug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedDrug = await Drug.findByIdAndDelete(id);
    if (!deletedDrug) res.status(404).json({ message: "Drug not found" });

    res.json({ message: "Drug deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
