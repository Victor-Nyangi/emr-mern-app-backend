import { Request, Response } from "express";
import Test from "../models/Visit/Test";
import mongoose from "mongoose";

import { handleError } from "../utils/handleError";

// Get all tests
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const tests = await Test.find();
    res.status(200).json(tests);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single test
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) res.status(404).json({ message: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    handleError(res, error, 404);
  }
};

export const create = async (req: Request, res: Response) => {
  const {
    testName,
    visit_id,
    dateOrdered,
    status,
    result,
    ordered_by
  } = req.body;

  try {
    const newTest = new Test({
      testName,
      visit_id,
      dateOrdered,
      status,
      result,
      ordered_by
    });

    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
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
      testName,
      status,
      result,
      ordered_by
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).send(`No test with id: ${id}`);

    const payload = {
      testName,
      status,
      result,
      ordered_by,
      _id: id,
    };

    const updatedTest = await Test.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedTest)
      res.status(404).json({ message: "Test not found" });

    res.json(updatedTest);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a test
export const deleteTest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest)
      res.status(404).json({ message: "Test not found" });

    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's tests
export const getTestsByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tests = await Test.find(
      {
        visit_id: req.params.visitId,
      },
      "testName dateOrdered status result ordered_by createdAt updatedAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(tests);
  } catch (error) {
    handleError(res, error, 500);
  }
};
