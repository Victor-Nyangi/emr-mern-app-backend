import {
  getAll,
  create,
  single,
  update,
  deleteMedicalProvider,
} from "../../controllers/medicalProviderController";
import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  requireMedicalProviderRead,
  requireMedicalProviderWrite,
  requireMedicalProviderCreate,
  requireMedicalProviderDelete,
} from "../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all medicalProviders
router.get("/", requireMedicalProviderRead, getAll);

// Create a new medicalProvider
router.post("/", requireMedicalProviderCreate, create);

// Retrieve a single medicalProvider with id
router.get("/:id", requireMedicalProviderRead, single);

// Update a medicalProvider with id
router.patch("/:id", requireMedicalProviderWrite, update);

// Delete a medicalProvider with id
router.delete("/:id", requireMedicalProviderDelete, deleteMedicalProvider);

export default router;
