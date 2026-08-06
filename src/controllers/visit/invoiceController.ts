import { Request, Response } from "express";

import Invoice from "../../models/Visit/Invoice";
import { generateInvoiceNumber } from "../../utils/generator-functions";
import mongoose from "mongoose";

import { handleError } from "../../utils/handleError";

// Get all policies
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const policies = await Invoice.find();
    res.status(200).json(policies);
  } catch (error) {
    handleError(res, error, 404);
  }
};

// Get a single invoice
export const single = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    handleError(res, error, 404);
  }
};
export const create = async (req: Request, res: Response): Promise<void> => {
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
  try {
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

    if (!updatedInvoice) res.status(404).json({ message: "Invoice not found" });

    res.json(updatedInvoice);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Delete a invoice
export const deleteInvoice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      res.status(404).json({ message: "Invalid ID" });

    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Fetch a visit's invoices
export const getInvoicesByVisit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoices = await Invoice.find(
      {
        visitId: req.params.visitId,
      },
      "visitId service_charged description payment_mode amount copayAmount status notes invoiceNumber createdAt"
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
      { totalAmount: 0, totalCopay: 0, totalUnpaid: 0 }
    );

    // Example return
    res.status(200).json({
      invoices,
      totals,
    });
  } catch (error) {
    handleError(res, error, 500);
  }
};
