import { Request, Response } from "express";
import mongoose from "mongoose";
import Department from "../models/Department";

import { handleError } from "../utils/handleError";

// Get all departments
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single department
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) res.status(404).json({ message: "Department not found" });
    res.status(200).json(department);
  } catch (error) {
    handleError(res, error, 404);
  }
};
export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, type, description, updated_date } = req.body;

  try {
    const newDepartment = new Department({ name, type, description, updated_date });

    const savedDepartment = await newDepartment.save();

    res.status(201).json(savedDepartment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const { name, type, description, updated_date } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = { name, type, description, updated_date, _id: id };

    const updatedDepartment = await Department.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedDepartment)
      res.status(404).json({ message: "Department not found" });

    res.json(updatedDepartment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a department
export const deleteDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment)
      res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
