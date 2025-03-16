import {
  create,
  single,
  deleteDepartment,
  getAll,
  update,
} from "../../controllers/departmentController";
import { Router } from "express";

const router = Router();

// Retrieve all departments
router.get("/", getAll);

// Create a new department
router.post("/", create);

// Retrieve a single department with id
router.get("/:id", single);

// Update a department with id
router.patch("/:id", update);

// Delete a department with id
router.delete("/:id", deleteDepartment);

export default router;
