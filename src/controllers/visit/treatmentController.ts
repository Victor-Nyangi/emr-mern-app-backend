import { Request, Response } from "express";
import mongoose from "mongoose";
import Treatment from "../../models/Visit/Treatment";

import { handleError } from "../../utils/handleError";

// Get all treatments
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const treatments = await Treatment.find();
    res.status(200).json(treatments);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single treatment
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) res.status(404).json({ message: "Treatment not found" });
    res.status(200).json(treatment);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const create = async (req: Request, res: Response) => {
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

  try {
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

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No treatment with id: ${id}`);

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
    if (!updatedTreatment)
      res.status(404).json({ message: "Treatment not found" });

    res.json(updatedTreatment);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a treatment
export const deleteTreatment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedTreatment = await Treatment.findByIdAndDelete(id);
    if (!deletedTreatment)
      res.status(404).json({ message: "Treatment not found" });

    res.json({ message: "Treatment deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's treatments
export const getTreatmentsByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const treatments = await Treatment.find(
      {
        visitId: req.params.visitId,
      },
      "visitId name type startDate endDate medicalProvider_id status notes isRecommended progress priority createdAt"
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
  } catch (error) {
    handleError(res, error, 500);
  }
};
