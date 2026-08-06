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

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all visits
router.get("/", requireVisitRead, getAll);

// Create a new visit
router.post("/", requireVisitCreate, create);

// Retrieve a single visit with id
router.get("/:id", requireVisitRead, single);

// Update a visit with id
router.patch("/:id", requireVisitWrite, update);

// Cancel a visit with id
router.patch("/cancel/:id", requireVisitWrite, cancelVisit);

// Transition a visit with id
router.patch("/transition/:id/", requireVisitWrite, transition);

export default router;
