import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Appointment from "../models/Patient/Appointment";

// Get all appointments
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const appointments = await Appointment.find({}).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
      {
        path: "patient_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    res.status(200).json(appointments);
  },
);

// Get a single appointment
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const appointment = await Appointment.findById(req.params.id).populate([
      {
        path: "medicalProvider_id",
        select: "first_name last_name salutation _id",
      },
      {
        path: "patient_id",
        select: "first_name last_name salutation _id",
      },
    ]);
    if (!appointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }
    res.status(200).json(appointment);
  },
);

// Create a new appointment
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  },
);

// Update a appointment
export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const { patient_id, medicalProvider_id, status, type, date } = req.body;

    const payload = {
      patient_id,
      medicalProvider_id,
      status,
      type,
      date,
      _id: id,
    };

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      },
    );
    if (!updatedAppointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    res.json(updatedAppointment);
  },
);

// Delete a appointment
export const deleteAppointment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    res.json({ message: "Appointment deleted successfully" });
  },
);
