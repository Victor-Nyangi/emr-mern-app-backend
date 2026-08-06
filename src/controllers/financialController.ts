import { Request, Response } from "express";
import mongoose from "mongoose";
import Financial from "../models/Financial";

import { handleError } from "../utils/handleError";

// Get all financials
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const financials = await Financial.find();

    res.status(200).json(financials);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single financial
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const financial = await Financial.findById(req.params.id);
    if (!financial) res.status(404).json({ message: "Financial not found" });
    res.status(200).json(financial);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a financial
export const create = async (req: Request, res: Response): Promise<void> => {
  const {
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
  } = req.body;

  try {
  const newFinancial = new Financial({
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
  });

   const savedFinancial =  await newFinancial.save();

    res.status(201).json(savedFinancial);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a financial
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No financial with id: ${id}`);
  const {
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
  } = req.body;

  if (!req.body) {
    res.status(400).send({
      message: "Please fill all required fields",
    });
  }
  const payload = {
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
    _id: id,
  };

  const updatedFinancial = await Financial.findByIdAndUpdate(id, payload, { new: true });
  if (!updatedFinancial) res.status(404).json({ message: "Financial not found" });

  res.json(updatedFinancial);
} catch (error) {
  handleError(res, error, 400);
}};

// Delete a financial
export const deleteFinancial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedFinancial = await Financial.findByIdAndDelete(id);
    if (!deletedFinancial) res.status(404).json({ message: "Financial not found" });

    res.json({ message: "Financial deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

