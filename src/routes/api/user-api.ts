import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  registerUser,
  loginUser,
  getMe,
} from "../../controllers/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
