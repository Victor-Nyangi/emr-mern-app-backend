import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Treatment from "../../models/Visit/Treatment";

// Get all treatments
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const treatments = await Treatment.find();
    res.status(200).json(treatments);
  },
);

// Get a single treatment
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      res.status(404);
      throw new Error("Treatment not found");
    }
    res.status(200).json(treatment);
  },
);

export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      visitId,
      name,
      type,
      startDate,
      endDate,
      medicalProvider_id,
      status,
      notes,
      isRecommended,
      progress,
      priority,
    } = req.body;

    const newTreatment = new Treatment({
      visitId,
      name,
      type,
      startDate,
      endDate,
      medicalProvider_id,
      status,
      notes,
      isRecommended,
      progress,
      priority,
    });

    const savedTreatment = await newTreatment.save();
    res.status(201).json(savedTreatment);
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
      type,
      startDate,
      endDate,
      medicalProvider_id,
      status,
      notes,
      isRecommended,
      progress,
      priority,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No treatment with id: ${id}`);
    }

    const payload = {
      name,
      type,
      startDate,
      endDate,
      medicalProvider_id,
      status,
      notes,
      isRecommended,
      progress,
      priority,
      _id: id,
    };

    const updatedTreatment = await Treatment.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedTreatment) {
      res.status(404);
      throw new Error("Treatment not found");
    }

    res.json(updatedTreatment);
  },
);

// Delete a treatment
export const deleteTreatment = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedTreatment = await Treatment.findByIdAndDelete(id);
    if (!deletedTreatment) {
      res.status(404);
      throw new Error("Treatment not found");
    }

    res.json({ message: "Treatment deleted successfully" });
  },
);

// Fetch a visit's treatments
export const getTreatmentsByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const treatments = await Treatment.find(
      {
        visitId: req.params.visitId,
      },
      "visitId name type startDate endDate medicalProvider_id status notes isRecommended progress priority createdAt",
    )
      .populate([
        {
          path: "medicalProvider_id",
          select: "first_name last_name salutation _id",
        },
      ])
      .sort({ createdAt: -1 })
      .lean();

    const current_treatments = treatments.filter((med) => {
      return med.type === "Procedure";
    });

    const recommended_treatments = treatments.filter((med) => {
      return med.type !== "Procedure";
    });

    // Example return
    res.status(200).json({
      recommended_treatments,
      current_treatments,
    });
  },
);
