import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Drug from "../models/Drug";

// Get all drugs
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const drugs = await Drug.find();
    res.status(200).json(drugs);
  },
);

// Get a single drug
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      res.status(404);
      throw new Error("Drug not found");
    }
    res.status(200).json(drug);
  },
);

// Create a drug
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, manufacter_date, expiry_date, updated_date } =
      req.body;

    const newDrug = new Drug({
      name,
      description,
      manufacter_date,
      expiry_date,
      updated_date,
    });

    const savedDrug = await newDrug.save();

    res.status(201).json(savedDrug);
  },
);

// Update drug
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

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
    if (!updatedDrug) {
      res.status(404);
      throw new Error("Drug not found");
    }

    res.json(updatedDrug);
  },
);

// Delete a drug
export const deleteDrug = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedDrug = await Drug.findByIdAndDelete(id);
    if (!deletedDrug) {
      res.status(404);
      throw new Error("Drug not found");
    }

    res.json({ message: "Drug deleted successfully" });
  },
);
