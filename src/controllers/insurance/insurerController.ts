import { Request, Response } from "express";
import mongoose from "mongoose";
import BenefitPlan from "../../models/Insurance/BenefitPlan";
import Insurer from "../../models/Insurance/Insurer";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all insurers
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const insurers = await Insurer.find();
    res.status(200).json(insurers);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single insurer
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const insurerId = req.params.id;
    const insurer = await Insurer.findById(insurerId);

    const benefitPlans = await BenefitPlan.find(
      { insurerId },
      "name description coverageType coverageDetails coveredServices"
    ).lean(); // Returns plain JS object instead of Mongoose doc

    if (!insurer) res.status(404).json({ message: "Insurer not found" });
    res.status(200).json({ insurer: insurer, benefit_plans: benefitPlans });
  } catch (error) {
    handleError(res, error, 404);
  }
};
export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, status, panel, payerId, contnact, agent } = req.body;

  try {
    const newInsurer = new Insurer({
      name,
      status,
      panel,
      payerId,
      contnact,
      agent,
    });

    const savedInsurer = await newInsurer.save();

    res.status(201).json(savedInsurer);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const { name, status, panel, payerId, contnact, agent } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = { name, status, panel, payerId, contnact, agent, _id: id };

    const updatedInsurer = await Insurer.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedInsurer) res.status(404).json({ message: "Insurer not found" });

    res.json(updatedInsurer);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a insurer
export const deleteInsurer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedInsurer = await Insurer.findByIdAndDelete(id);
    if (!deletedInsurer) res.status(404).json({ message: "Insurer not found" });

    res.json({ message: "Insurer deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
