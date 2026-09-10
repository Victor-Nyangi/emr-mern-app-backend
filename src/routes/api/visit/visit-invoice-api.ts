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

import { validate } from "../../../middleware/validate";
import { createInvoiceSchema, updateInvoiceSchema } from "../../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all invoices
router.get("/", requireBillingRead, getAll);

// Create a new invoice
router.post("/", requireBillingCreate, validate(createInvoiceSchema), create);

// Retrieve a single invoice with id
router.get("/:id", requireBillingRead, single);

// Update a invoice with id
router.patch(
  "/:id",
  requireBillingWrite,
  validate(updateInvoiceSchema),
  update,
);

// Delete a invoice with id
router.delete("/:id", requireBillingDelete, deleteInvoice);

// Fetch invoice by visit id
router.get("/visit/:visitId", requireBillingRead, getInvoicesByVisit);

export default router;
