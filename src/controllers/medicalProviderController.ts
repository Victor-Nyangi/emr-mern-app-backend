import { Request, Response } from "express";
import mongoose from "mongoose";
import MedicalProvider from "../models/MedicalProvider";

import { handleError } from "../utils/handleError";

// Get all medicalProviders
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicalProviders = await MedicalProvider.find();

    res.status(200).json(medicalProviders);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single medicalProvider
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicalProvider = await MedicalProvider.findById(req.params.id);
    if (!medicalProvider) res.status(404).json({ message: "MedicalProvider not found" });
    res.status(200).json(medicalProvider);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a medicalProvider
export const create = async (req: Request, res: Response): Promise<void> => {
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

  try {
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
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update medicalProvider
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

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

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

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

    const updatedMedicalProvider = await MedicalProvider.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.json(updatedMedicalProvider);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteMedicalProvider = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedMedicalProvider = await MedicalProvider.findByIdAndDelete(id);
    if (!deletedMedicalProvider) res.status(404).json({ message: "MedicalProvider not found" });

    res.json({ message: "MedicalProvider deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
