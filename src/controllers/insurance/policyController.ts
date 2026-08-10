import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Policy from "../../models/Insurance/Policy";
import {
  generateMemberIdHashed,
  generatePolicyNumber,
} from "../../utils/generator-functions";

// Get all policies
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const policies = await Policy.find({}).populate([
      {
        path: "patientId",
        select: "first_name last_name _id",
      },
      {
        path: "benefitPlanId",
        select: "name _id",
        populate: {
          // Nested populate to get the insurer
          path: "insurerId",
          select: "name _id",
        },
      },
    ]);
    res.status(200).json(policies);
  },
);

// Get a single policy
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const policy = await Policy.findById(req.params.id).populate([
      {
        path: "patientId",
        select: "first_name last_name _id",
      },
      {
        path: "benefitPlanId",
        select: "name _id",
        populate: {
          // Nested populate to get the insurer
          path: "insurerId",
          select: "name _id",
        },
      },
    ]);
    if (!policy) {
      res.status(404);
      throw new Error("Policy not found");
    }
    res.status(200).json(policy);
  },
);
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      patientId,
      benefitPlanId,
      coverageType,
      effectiveDate,
      expiryDate,
      isActive,
    } = req.body;
    // Create a unique policy number:
    const policyNumber = generatePolicyNumber();

    // Generate a hased member id:
    const memberId = generateMemberIdHashed(patientId);

    const newPolicy = new Policy({
      patientId,
      benefitPlanId,
      coverageType,
      effectiveDate,
      expiryDate,
      policyNumber: policyNumber,
      memberId: memberId,
      isActive,
    });

    const savedPolicy = await newPolicy.save();

    res.status(201).json(savedPolicy);
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
      patientId,
      benefitPlanId,
      coverageType,
      effectiveDate,
      expiryDate,
      isActive,
    } = req.body;

    const payload = {
      patientId,
      benefitPlanId,
      coverageType,
      effectiveDate,
      expiryDate,
      isActive,
      _id: id,
    };

    const updatedPolicy = await Policy.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedPolicy) {
      res.status(404);
      throw new Error("Policy not found");
    }

    res.json(updatedPolicy);
  },
);

// Delete a policy
export const deletePolicy = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedPolicy = await Policy.findByIdAndDelete(id);
    if (!deletedPolicy) {
      res.status(404);
      throw new Error("Policy not found");
    }

    res.json({ message: "Policy deleted successfully" });
  },
);
