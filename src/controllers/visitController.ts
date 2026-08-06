import { Request, Response } from "express";
import mongoose from "mongoose";
import Visit from "../models/Visit/Visit";
import Patient from "../models/Patient/Patient";

import { handleError } from "../utils/handleError";

// Get all visits
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const visits = await Visit.find({})
      .populate("patient_id", "first_name last_name") // Populate patient_id and select only the 'name' field
      .populate("currentQueue", "name"); // Populate currentQueue and select only the 'name' field

    res.status(200).json(visits);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single visit
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
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

    if (!visit) res.status(404).json({ message: "Visit not found" });
    res.status(200).json({ visit, patient });
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a visit
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a visit
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No visit with id: ${id}`);

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

    if (!updatedVisit) res.status(404).json({ message: "Visit not found" });

    res.json(updatedVisit);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Transition a visit
export const transition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No visit with id: ${id}`);

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
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Cancel a visit
export const cancelVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No visit with id: ${id}`);

    const payload = {
      status: "CANCELLED",
      updatedAt: new Date(),
      _id: id,
    };

    const updatedVisit = await Visit.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedVisit) res.status(404).json({ message: "Visit not found" });

    res.json(updatedVisit);
  } catch (error) {
    handleError(res, error, 400);
  }
};
