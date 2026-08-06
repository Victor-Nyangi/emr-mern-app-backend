import { Request, Response } from "express";
import mongoose from "mongoose";
import Service from "../models/Service";

import { handleError } from "../utils/handleError";

// Get all services
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single service
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a new service
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a service
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const { name, description, charge, main_purpose, updated_date } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      name,
      description,
      charge,
      main_purpose,
      updated_date,
      _id: id,
    };

    const updatedService = await Service.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedService) res.status(404).json({ message: "Service not found" });

    res.json(updatedService);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a service
export const deleteService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
