import { Request, Response } from "express";
import mongoose from "mongoose";
import Member from "../models/Member";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all members
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const members = await Member.find();

    res.status(200).json(members);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single member
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Create a member
export const create = async (req: Request, res: Response): Promise<void> => {
  const {
    first_name,
    last_name,
    date_of_birth,
    address,
    phone_number,
    email,
    gender,
    salutation,
    department,
    role,
    is_active,
    updated_date,
  } = req.body;

  try {
    const newMember = new Member({
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Update member
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const {
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      first_name,
      last_name,
      date_of_birth,
      address,
      phone_number,
      email,
      gender,
      salutation,
      department,
      role,
      is_active,
      updated_date,
      _id: id,
    };

    const updatedMember = await Member.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.json(updatedMember);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
