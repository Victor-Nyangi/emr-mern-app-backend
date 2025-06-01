import { createInvoice } from "../../../controllers/visit/invoiceGeneratorController";
import {
  create,
  single,
  getAll,
  update,
  deleteInvoice,
  getInvoicesByVisit,
} from "../../../controllers/visit/invoiceController";

import { Router } from "express";

const router = Router();

// Retrieve all invoices
router.get("/", getAll);

// Create a new invoice
router.post("/", create);

// Retrieve a single invoice with id
router.get("/:id", single);

// Update a invoice with id
router.patch("/:id", update);

// Delete a invoice with id
router.delete("/:id", deleteInvoice);

// Fetch invoice by visit id
router.get("/visit/:visitId", getInvoicesByVisit);

// invoice items
router.post("/invoice", createInvoice);

export default router;
