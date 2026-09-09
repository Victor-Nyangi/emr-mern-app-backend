import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Financial from "../models/Financial";

// Get all financials
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const financials = await Financial.find();

    res.status(200).json(financials);
  },
);

// Get a single financial
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const financial = await Financial.findById(req.params.id);
    if (!financial) {
      res.status(404);
      throw new Error("Financial not found");
    }
    res.status(200).json(financial);
  },
);

// Create a financial
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      patient_name,
      account_name,
      account_number,
      account_type,
      updated_date,
    } = req.body;

    const newFinancial = new Financial({
      patient_name,
      account_name,
      account_number,
      account_type,
      updated_date,
    });

    const savedFinancial = await newFinancial.save();

    res.status(201).json(savedFinancial);
  },
);

// Update a financial
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No financial with id: ${id}`);
    }
    const {
      patient_name,
      account_name,
      account_number,
      account_type,
      updated_date,
    } = req.body;

    const payload = {
      patient_name,
      account_name,
      account_number,
      account_type,
      updated_date,
      _id: id,
    };

    const updatedFinancial = await Financial.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedFinancial) {
      res.status(404);
      throw new Error("Financial not found");
    }

    res.json(updatedFinancial);
  },
);

// Delete a financial
export const deleteFinancial = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedFinancial = await Financial.findByIdAndDelete(id);
    if (!deletedFinancial) {
      res.status(404);
      throw new Error("Financial not found");
    }

    res.json({ message: "Financial deleted successfully" });
  },
);
