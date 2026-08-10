import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Service from "../models/Service";

// Get all services
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const services = await Service.find();
    res.status(200).json(services);
  },
);

// Get a single service
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }
    res.status(200).json(service);
  },
);

// Create a new service
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  },
);

// Update a service
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const { name, description, charge, main_purpose, updated_date } = req.body;

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
    if (!updatedService) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json(updatedService);
  },
);

// Delete a service
export const deleteService = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      res.status(404);
      throw new Error("Service not found");
    }

    res.json({ message: "Service deleted successfully" });
  },
);
