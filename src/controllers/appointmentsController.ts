import { Request, Response } from "express";
import mongoose from "mongoose";
import Appointment from "../models/Patient/Appointment";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all appointments
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single appointment
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
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
    if (!appointment)
      res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a new appointment
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update a appointment
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const { patient_id, medicalProvider_id, status, type, date } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

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
      }
    );
    if (!updatedAppointment)
      res.status(404).json({ message: "Appointment not found" });

    res.json(updatedAppointment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a appointment
export const deleteAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment)
      res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
