import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Billing from "../models/Billing";

// Get all billings
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const billings = await Billing.find();
    res.status(200).json(billings);
  },
);

// Get a single billing
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      res.status(404);
      throw new Error("Billing not found");
    }
    res.status(200).json(billing);
  },
);

export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
    if (!updatedBilling) {
      res.status(404);
      throw new Error("Billing not found");
    }

    res.json(updatedBilling);
  },
);

// Delete a billing
export const deleteBilling = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedBilling = await Billing.findByIdAndDelete(id);
    if (!deletedBilling) {
      res.status(404);
      throw new Error("Billing not found");
    }

    res.json({ message: "Billing deleted successfully" });
  },
);
