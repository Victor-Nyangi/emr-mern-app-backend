import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import BenefitPlan from "../../models/Insurance/BenefitPlan";
import Insurer from "../../models/Insurance/Insurer";

// Get all insurers
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const insurers = await Insurer.find();
    res.status(200).json(insurers);
  },
);

// Get a single insurer
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const insurerId = req.params.id;
    const insurer = await Insurer.findById(insurerId);

    const benefitPlans = await BenefitPlan.find(
      { insurerId },
      "name description coverageType createdAt",
    )
      .populate("insurerId", "name _id")
      .lean(); // Returns plain JS object instead of Mongoose doc

    if (!insurer) {
      res.status(404);
      throw new Error("Insurer not found");
    }
    res.status(200).json({ insurer: insurer, benefit_plans: benefitPlans });
  },
);
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, status, panel, payerId, contact, agent } = req.body;

    const newInsurer = new Insurer({
      name,
      status,
      panel,
      payerId,
      contact,
      agent,
    });

    const savedInsurer = await newInsurer.save();

    res.status(201).json(savedInsurer);
  },
);

export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const { name, status, panel, payerId, contact, agent } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = { name, status, panel, payerId, contact, agent, _id: id };

    const updatedInsurer = await Insurer.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedInsurer) {
      res.status(404);
      throw new Error("Insurer not found");
    }

    res.json(updatedInsurer);
  },
);

// Delete a insurer
export const deleteInsurer = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedInsurer = await Insurer.findByIdAndDelete(id);
    if (!deletedInsurer) {
      res.status(404);
      throw new Error("Insurer not found");
    }

    res.json({ message: "Insurer deleted successfully" });
  },
);
