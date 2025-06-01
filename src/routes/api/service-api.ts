import {
  create,
  single,
  deleteService,
  getAll,
  update,
} from "../../controllers/serviceController";
import { Router } from "express";

const router = Router();

// Retrieve all services
router.get("/", getAll);

// Create a new service
router.post("/", create);

// Retrieve a single service with id
router.get("/:id", single);

// Update a service with id
router.patch("/:id", update);

// Delete a service with id
router.delete("/:id", deleteService);

export default router;
