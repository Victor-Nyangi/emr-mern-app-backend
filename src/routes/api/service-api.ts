import {
  create,
  single,
  deleteService,
  getAll,
  update,
} from "../../controllers/serviceController";
import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate";
import { createServiceSchema, updateServiceSchema } from "../../schemas";
import {
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
} from "../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all services
router.get("/", requireBillingRead, getAll);

// Create a new service
router.post("/", requireBillingCreate, validate(createServiceSchema), create);

// Retrieve a single service with id
router.get("/:id", requireBillingRead, single);

// Update a service with id
router.patch(
  "/:id",
  requireBillingWrite,
  validate(updateServiceSchema),
  update,
);

// Delete a service with id
router.delete("/:id", requireBillingDelete, deleteService);

export default router;
