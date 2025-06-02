import { Request, Response } from "express";
import mongoose from "mongoose";
import Queue from "../models/Queue";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all queues
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const queues = await Queue.find({}).populate([
      {
        path: "departmentId",
        select: "name _id",
      },
      {
        path: "assignedTo",
        select: "first_name last_name salutation _id",
      },
    ]);

    res.status(200).json(queues);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single queue
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const queue = await Queue.findById(req.params.id).populate([
      {
        path: "departmentId",
        select: "name _id",
      },
      {
        path: "assignedTo",
        select: "first_name last_name salutation _id",
      },
    ]);
    if (!queue) res.status(404).json({ message: "Queue not found" });
    res.status(200).json(queue);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a queue
export const create = async (req: Request, res: Response): Promise<void> => {
  const {
    departmentId,
    name,
    priority,
    status,
    assignedTo,
    serviceStartTime,
    serviceEndTime,
    notes,
  } = req.body;

  try {
    const newQueue = new Queue({
      departmentId,
      name,
      priority,
      status,
      assignedTo,
      serviceStartTime,
      serviceEndTime,
      notes,
    });

    const savedQueue = await newQueue.save();
    res.status(201).json(savedQueue);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update queue
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const {
      departmentId,
      name,
      priority,
      status,
      assignedTo,
      serviceStartTime,
      serviceEndTime,
      notes,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      departmentId,
      name,
      priority,
      status,
      assignedTo,
      serviceStartTime,
      serviceEndTime,
      notes,
      _id: id,
    };

    const updatedQueue = await Queue.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.json(updatedQueue);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedQueue = await Queue.findByIdAndDelete(id);
    if (!deletedQueue) res.status(404).json({ message: "Queue not found" });

    res.json({ message: "Queue deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
