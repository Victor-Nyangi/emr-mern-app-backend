import { Router } from "express";
import {
  create,
  getAll,
  update,
  single,
  cancelVisit,
  transition,
} from "../../controllers/visitController";
import { protect } from "../../middleware/authMiddleware";
import {
  requireVisitRead,
  requireVisitWrite,
  requireVisitCreate,
  requireVisitDelete,
} from "../../middleware/authorizationMiddleware";
import { validate } from "../../middleware/validate";
import {
  createVisitSchema,
  updateVisitSchema,
  transitionVisitSchema,
} from "../../schemas";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all visits
router.get("/", requireVisitRead, getAll);

// Create a new visit
router.post("/", requireVisitCreate, validate(createVisitSchema), create);

// Retrieve a single visit with id
router.get("/:id", requireVisitRead, single);

// Update a visit with id
router.patch("/:id", requireVisitWrite, validate(updateVisitSchema), update);

// Cancel a visit with id. Takes no body -- the controller hardcodes the
// CANCELLED status -- so there is nothing to validate.
router.patch("/cancel/:id", requireVisitWrite, cancelVisit);

// Transition a visit with id
router.patch(
  "/transition/:id/",
  requireVisitWrite,
  validate(transitionVisitSchema),
  transition,
);

export default router;
