import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import MedicalProvider from "../models/MedicalProvider";

// Get all medicalProviders
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const medicalProviders = await MedicalProvider.find();

    res.status(200).json(medicalProviders);
  },
);

// Get a single medicalProvider
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const medicalProvider = await MedicalProvider.findById(req.params.id);
    if (!medicalProvider) {
      res.status(404);
      throw new Error("MedicalProvider not found");
    }
    res.status(200).json(medicalProvider);
  },
);

// Create a medicalProvider
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
    } = req.body;

    const newMedicalProvider = new MedicalProvider({
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
    });

    const savedMedicalProvider = await newMedicalProvider.save();
    res.status(201).json(savedMedicalProvider);
  },
);

// Update medicalProvider
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const {
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
    } = req.body;

    const payload = {
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
      _id: id,
    };

    const updatedMedicalProvider = await MedicalProvider.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      },
    );

    res.json(updatedMedicalProvider);
  },
);

export const deleteMedicalProvider = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedMedicalProvider = await MedicalProvider.findByIdAndDelete(id);
    if (!deletedMedicalProvider) {
      res.status(404);
      throw new Error("MedicalProvider not found");
    }

    res.json({ message: "MedicalProvider deleted successfully" });
  },
);
