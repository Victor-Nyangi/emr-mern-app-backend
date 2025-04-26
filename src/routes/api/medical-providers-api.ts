import {
  getAll,
  create,
  single,
  update,
  deleteMedicalProvider,
} from "../../controllers/medicalProviderController";
import { Router } from "express";

const router = Router();
// Retrieve all medicalProviders
router.get("/", getAll);

// Create a new medicalProvider
router.post("/", create);

// Retrieve a single medicalProvider with id
router.get("/:id", single);

// Update a medicalProvider with id
router.patch("/:id", update);

// Delete a medicalProvider with id
router.delete("/:id", deleteMedicalProvider);

export default router;
