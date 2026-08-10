import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Department from "../models/Department";

// Get all departments
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const departments = await Department.find();
    res.status(200).json(departments);
  },
);

// Get a single department
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }
    res.status(200).json(department);
  },
);
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, type, description, updated_date } = req.body;

    const newDepartment = new Department({
      name,
      type,
      description,
      updated_date,
    });

    const savedDepartment = await newDepartment.save();

    res.status(201).json(savedDepartment);
  },
);

export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const { name, type, description, updated_date } = req.body;

    const payload = { name, type, description, updated_date, _id: id };

    const updatedDepartment = await Department.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedDepartment) {
      res.status(404);
      throw new Error("Department not found");
    }

    res.json(updatedDepartment);
  },
);

// Delete a department
export const deleteDepartment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      res.status(404);
      throw new Error("Department not found");
    }

    res.json({ message: "Department deleted successfully" });
  },
);
