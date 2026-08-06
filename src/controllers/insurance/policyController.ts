import { Request, Response } from "express";
import mongoose from "mongoose";
import Policy from "../../models/Insurance/Policy";
import { handleError } from "../../utils/handleError";

import {
  generateMemberIdHashed,
  generatePolicyNumber,
} from "../../utils/generator-functions";

// Get all policies
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single policy
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
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
    if (!policy) res.status(404).json({ message: "Policy not found" });
    res.status(200).json(policy);
  } catch (error) {
    handleError(res, error, 404);
  }
};
export const create = async (req: Request, res: Response): Promise<void> => {
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
  try {
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
      patientId,
      benefitPlanId,
      coverageType,
      effectiveDate,
      expiryDate,
      isActive,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

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

    if (!updatedPolicy) res.status(404).json({ message: "Policy not found" });

    res.json(updatedPolicy);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a policy
export const deletePolicy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedPolicy = await Policy.findByIdAndDelete(id);
    if (!deletedPolicy) res.status(404).json({ message: "Policy not found" });

    res.json({ message: "Policy deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
