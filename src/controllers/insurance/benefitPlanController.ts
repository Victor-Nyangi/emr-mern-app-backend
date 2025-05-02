import { Request, Response } from "express";
import mongoose from "mongoose";
import BenefitPlan from "../../models/Insurance/BenefitPlan";

// Centralized error handler
const handleError = (res: Response, error: unknown, statusCode = 500) => {
  console.error(error);
  const message =
    error instanceof Error ? error.message : "Internal Server Error";
  res.status(statusCode).json({ message });
};

// Get all benefit plans
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const benefit_plans = await BenefitPlan.find({}).populate(
      "insurerId",
      "name _id"
    ); // Populate the 'insurerId' and select only the 'name' and id
    res.status(200).json(benefit_plans);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single benefit plan
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const benefit_plan = await BenefitPlan.findById(req.params.id).populate(
      "insurerId",
      "name _id"
    );
    if (!benefit_plan)
      res.status(404).json({ message: "Benefit Plan not found" });
    res.status(200).json(benefit_plan);
  } catch (error) {
    handleError(res, error, 404);
  }
};
export const create = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    insurerId,
    description,
    coverageType,
    coverageDetails,
    costSharing,
    outOfPocketMax,
    coveredServices,
    exclusions,
  } = req.body;

  try {
    const newBenefitPlan = new BenefitPlan({
      name,
      insurerId,
      description,
      coverageType,
      coverageDetails,
      costSharing,
      outOfPocketMax,
      coveredServices,
      exclusions,
    });

    const savedBenefitPlan = await newBenefitPlan.save();

    res.status(201).json(savedBenefitPlan);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const {
      name,
      insurerId,
      description,
      coverageType,
      coverageDetails,
      costSharing,
      outOfPocketMax,
      coveredServices,
      exclusions,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      name,
      insurerId,
      description,
      coverageType,
      coverageDetails,
      costSharing,
      outOfPocketMax,
      coveredServices,
      exclusions,
      _id: id,
    };

    const updatedBenefitPlan = await BenefitPlan.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      }
    );

    if (!updatedBenefitPlan)
      res.status(404).json({ message: "Benefit Plan not found" });

    res.json(updatedBenefitPlan);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a benefit plan
export const deleteBenefitPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedBenefitPlan = await BenefitPlan.findByIdAndDelete(id);
    if (!deletedBenefitPlan)
      res.status(404).json({ message: "Benefit Plan not found" });

    res.json({ message: "Benefit Plan deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
