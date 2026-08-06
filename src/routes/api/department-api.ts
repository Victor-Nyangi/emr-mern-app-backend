import {
  create,
  single,
  deleteDepartment,
  getAll,
  update,
} from "../../controllers/departmentController";
import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import { requireAdmin } from "../../middleware/authorizationMiddleware";

import { validate } from "../../middleware/validate";
import { createDepartmentSchema, updateDepartmentSchema } from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all departments
router.get("/", requireAdmin, getAll);

// Create a new department
router.post("/", requireAdmin, validate(createDepartmentSchema), create);

// Retrieve a single department with id
router.get("/:id", requireAdmin, single);

// Update a department with id
router.patch("/:id", requireAdmin, validate(updateDepartmentSchema), update);

// Delete a department with id
router.delete("/:id", requireAdmin, deleteDepartment);

export default router;
