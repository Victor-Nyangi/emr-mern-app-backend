import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import BenefitPlan from "../../models/Insurance/BenefitPlan";
import Policy from "../../models/Insurance/Policy";

// Get all benefit plans
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const benefit_plans = await BenefitPlan.find({}).populate(
      "insurerId",
      "name _id",
    ); // Populate the 'insurerId' and select only the 'name' and id
    res.status(200).json(benefit_plans);
  },
);

// Get a single benefit plan
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const benefit_plan = await BenefitPlan.findById(req.params.id).populate(
      "insurerId",
      "name _id",
    );
    if (!benefit_plan) {
      res.status(404);
      throw new Error("Benefit Plan not found");
    }
    res.status(200).json(benefit_plan);
  },
);
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

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
      },
    );

    if (!updatedBenefitPlan) {
      res.status(404);
      throw new Error("Benefit Plan not found");
    }

    res.json(updatedBenefitPlan);
  },
);

// Delete a benefit plan
export const deleteBenefitPlan = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedBenefitPlan = await BenefitPlan.findByIdAndDelete(id);
    if (!deletedBenefitPlan) {
      res.status(404);
      throw new Error("Benefit Plan not found");
    }

    res.json({ message: "Benefit Plan deleted successfully" });
  },
);

// Fetch a benefit plan's policies
export const getPoliciesByBenefitPlan = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const policies = await Policy.find({
      benefitPlanId: req.params.benefitPlanId,
    }).populate([
      {
        path: "patientId",
        select: "first_name last_name _id",
      },
      {
        path: "benefitPlanId",
        select: "name _id",
        populate: {
          path: "insurerId",
          select: "name _id",
        },
      },
    ]);

    res.status(200).json(policies);
  },
);
