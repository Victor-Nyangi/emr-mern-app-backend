import { askMedicalQuestion } from "../../controllers/emrAiController";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { protect } from "../../middleware/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Ask a medical question
// TODO: Add authorization middleware to restrict AI access
router.post(
  "/",
  protect,
  expressAsyncHandler(async (req, res) => {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ message: "Please provide a question" });
      return;
    }
    const answer = await askMedicalQuestion(question);
    res.status(201).json({ answer });
  })
);

export default router;
