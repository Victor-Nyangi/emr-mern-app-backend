import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Visit from "../models/Visit/Visit";
import Patient from "../models/Patient/Patient";

// Get all visits
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const visits = await Visit.find({})
      .populate("patient_id", "first_name last_name") // Populate patient_id and select only the 'name' field
      .populate("currentQueue", "name"); // Populate currentQueue and select only the 'name' field

    res.status(200).json(visits);
  },
);

// Get a single visit
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const visit = await Visit.findById(req.params.id).populate([
      {
        path: "currentQueue",
        select: "name _id",
        populate: [
          {
            path: "departmentId",
            select: "name _id",
          },
          {
            path: "assignedTo",
            select: "first_name last_name salutation _id",
          },
        ],
      },
    ]);
    const patient = await Patient.findById(visit?.patient_id);

    if (!visit) {
      res.status(404);
      throw new Error("Visit not found");
    }
    res.status(200).json({ visit, patient });
  },
);

// Create a visit
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { patient_id, payment_method, currentQueue, isFollowUp } = req.body;

    const newVisit = new Visit({
      patient_id,
      payment_method,
      currentQueue,
      isFollowUp,
      status: "ARRIVED",
      createdAt: new Date(),
    });

    const savedVisit = await newVisit.save();

    res.status(201).json(savedVisit);
  },
);

// Update a visit
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No visit with id: ${id}`);
    }

    const { patient_id, isFollowUp, payment_method, currentQueue, status } =
      req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      patient_id,
      payment_method,
      isFollowUp,
      status,
      currentQueue,
      startTime: new Date(),
      updatedAt: new Date(),
      _id: id,
    };

    const updatedVisit = await Visit.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedVisit) {
      res.status(404);
      throw new Error("Visit not found");
    }

    res.json(updatedVisit);
  },
);

// Transition a visit
export const transition = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No visit with id: ${id}`);
    }

    const { status, transition } = req.body;

    if (!req.body || !status) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }
    const visit = await Visit.findById(id);
    if (!visit) {
      res.status(404).json({ message: "Visit not found" });
      return;
    }
    if (transition) {
      visit.currentQueue = transition.queue;
      visit?.transitions.push({
        queue: transition.queue,
        prev_queue: transition.prev_queue,
        enteredAt: transition.enteredAt || new Date(),
      });
    }

    // Update status and updatedAt
    visit.status = status;
    visit.updatedAt = new Date();

    // Optionally calculate duration
    const currentTime = new Date();
    if (visit?.startTime) {
      const diffMs = currentTime.getTime() - visit.startTime.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      visit.duration = diffMin.toString();
    }

    if (status === "COMPLETED") {
      visit.endTime = currentTime;
    }

    const updatedVisit = await visit.save();

    res.json(updatedVisit);
  },
);

// Cancel a visit
export const cancelVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No visit with id: ${id}`);
    }

    const payload = {
      status: "CANCELLED",
      updatedAt: new Date(),
      _id: id,
    };

    const updatedVisit = await Visit.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedVisit) {
      res.status(404);
      throw new Error("Visit not found");
    }

    res.json(updatedVisit);
  },
);
