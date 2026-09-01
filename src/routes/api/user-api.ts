import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import { requireAdmin } from "../../middleware/authorizationMiddleware";
import {
  registerUser,
  loginUser,
  getMe,
} from "../../controllers/userController";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "../../schemas";

const router = Router();

// Staff accounts are created by an administrator, not self-service. A new
// user needs a role, department and employee_id assigned (all required by
// the User model), which the account holder cannot supply for themselves.
router.post(
  "/register",
  protect,
  requireAdmin,
  validate(registerSchema),
  registerUser
);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", protect, getMe);

export default router;
