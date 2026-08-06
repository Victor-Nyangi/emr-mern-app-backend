import { Request, Response } from "express";
import mongoose from "mongoose";
import Billing from "../models/Billing";

import { handleError } from "../utils/handleError";

// Get all billings
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const billings = await Billing.find();
    res.status(200).json(billings);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single billing
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) res.status(404).json({ message: "Billing not found" });
    res.status(200).json(billing);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const {
    patient_name,
    visit_id,
    services_charged,
    diagnosis,
    amount,
    insuranceProvider,
    notes,
    date_created,
    updated_date,
  } = req.body;
  try {
    const newBilling = new Billing({
      patient_name,
      visit_id,
      services_charged,
      diagnosis,
      amount,
      insuranceProvider,
      notes,
      date_created,
      updated_date,
    });

    const savedBilling = await newBilling.save();

    res.status(201).json(savedBilling);
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
      patient_name,
      services_charged,
      diagnosis,
      amountPaid,
      insuranceProvider,
      amount,
      date_created,
      notes,
      updated_date,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      patient_name,
      services_charged,
      amountPaid,
      diagnosis,
      insuranceProvider,
      amount,
      date_created,
      notes,
      updated_date,
      _id: id,
    };

    const updatedBilling = await Billing.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedBilling) res.status(404).json({ message: "Billing not found" });

    res.json(updatedBilling);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a billing
export const deleteBilling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedBilling = await Billing.findByIdAndDelete(id);
    if (!deletedBilling) res.status(404).json({ message: "Billing not found" });

    res.json({ message: "Billing deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
