import { Request, Response } from "express";

import expressAsyncHandler from "express-async-handler";
import Invoice from "../../models/Visit/Invoice";
import { generateInvoiceNumber } from "../../utils/generator-functions";
import mongoose from "mongoose";

// Get all policies
export const getAll = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const policies = await Invoice.find();
    res.status(200).json(policies);
  },
);

// Get a single invoice
export const single = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }
    res.status(200).json(invoice);
  },
);
export const create = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const {
      visitId,
      service_charged,
      description,
      payment_mode,
      amount,
      copayAmount,
      status,
      notes,
    } = req.body;
    // Create a unique invoice number:
    const invoiceNumber = generateInvoiceNumber();

    // Generate a hased member id:

    const newInvoice = new Invoice({
      visitId,
      service_charged,
      description,
      payment_mode,
      amount,
      copayAmount,
      status,
      notes,
      invoiceNumber: invoiceNumber,
    });

    const savedInvoice = await newInvoice.save();

    res.status(201).json(savedInvoice);
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
      service_charged,
      description,
      payment_mode,
      amount,
      copayAmount,
      status,
      notes,
    } = req.body;

    if (!req.body) {
      res.status(400).send({
        message: "Please fill all required fields",
      });
    }

    const payload = {
      service_charged,
      description,
      payment_mode,
      amount,
      copayAmount,
      status,
      notes,
      _id: id,
    };

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updatedInvoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }

    res.json(updatedInvoice);
  },
);

// Delete a invoice
export const deleteInvoice = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }

    res.json({ message: "Invoice deleted successfully" });
  },
);

// Fetch a visit's invoices
export const getInvoicesByVisit = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const invoices = await Invoice.find(
      {
        visitId: req.params.visitId,
      },
      "visitId service_charged description payment_mode amount copayAmount status notes invoiceNumber createdAt",
    )
      .sort({ createdAt: -1 })
      .lean();

    const totals = invoices.reduce(
      (acc, invoice) => {
        acc.totalAmount += invoice.amount || 0;
        acc.totalCopay += invoice.copayAmount || 0;
        if (invoice.status === "UNPAID") {
          acc.totalUnpaid += invoice.amount || 0;
        }
        return acc;
      },
      { totalAmount: 0, totalCopay: 0, totalUnpaid: 0 },
    );

    // Example return
    res.status(200).json({
      invoices,
      totals,
    });
  },
);
