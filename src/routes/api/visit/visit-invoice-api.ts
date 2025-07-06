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
import { protect } from "../../../middleware/authMiddleware";
import {
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
} from "../../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all invoices
router.get("/", requireBillingRead, getAll);

// Create a new invoice
router.post("/", requireBillingCreate, create);

// Retrieve a single invoice with id
router.get("/:id", requireBillingRead, single);

// Update a invoice with id
router.patch("/:id", requireBillingWrite, update);

// Delete a invoice with id
router.delete("/:id", requireBillingDelete, deleteInvoice);

// Fetch invoice by visit id
router.get("/visit/:visitId", requireBillingRead, getInvoicesByVisit);

// invoice items
router.post("/invoice", requireBillingCreate, createInvoice);

export default router;
