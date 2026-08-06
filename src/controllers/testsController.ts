import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Test from "../models/Visit/Test";
import mongoose from "mongoose";

// Get all tests
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const tests = await Test.find();
    res.status(200).json(tests);
  },
);

// Get a single test
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const test = await Test.findById(req.params.id);
    if (!test) {
      res.status(404);
      throw new Error("Test not found");
    }
    res.status(200).json(test);
  },
);

export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { testName, visit_id, dateOrdered, status, result, ordered_by } =
      req.body;

    const newTest = new Test({
      testName,
      visit_id,
      dateOrdered,
      status,
      result,
      ordered_by,
    });

    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  },
);

export const update = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const { testName, status, result, ordered_by } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error(`No test with id: ${id}`);
    }

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
    if (!updatedTest) {
      res.status(404);
      throw new Error("Test not found");
    }

    res.json(updatedTest);
  },
);

// Delete a test
export const deleteTest = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      res.status(404);
      throw new Error("Test not found");
    }

    res.json({ message: "Test deleted successfully" });
  },
);

// Fetch a visit's tests
export const getTestsByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const tests = await Test.find(
      {
        visit_id: req.params.visitId,
      },
      "testName dateOrdered status result ordered_by createdAt updatedAt",
    )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(tests);
  },
);
