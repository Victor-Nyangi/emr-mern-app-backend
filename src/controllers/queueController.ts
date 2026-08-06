import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Queue from "../models/Queue";

// Get all queues
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

// Get a single queue
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
    if (!queue) {
      res.status(404);
      throw new Error("Queue not found");
    }
    res.status(200).json(queue);
  },
);

// Create a queue
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

// Update queue
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

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
  },
);

export const deleteQueue = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedQueue = await Queue.findByIdAndDelete(id);
    if (!deletedQueue) {
      res.status(404);
      throw new Error("Queue not found");
    }

    res.json({ message: "Queue deleted successfully" });
  },
);
