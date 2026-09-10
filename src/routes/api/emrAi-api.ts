import { askMedicalQuestion } from "../../controllers/emrAiController";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { protect } from "../../middleware/authMiddleware";
import { requireClinicalNotesCreate } from "../../middleware/authorizationMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Ask a medical question. Gated on clinical_notes:create -- the same
// resource vitals/diagnoses/medications/tests already piggyback on, since
// "vital" etc. aren't yet their own ABAC resource types (see
// src/models/Role.ts). Create rather than Read: this follows the same
// verb convention every other POST route in the app uses, and it's the
// narrowest action that's still coherent here -- in the current role
// data (src/data/permissions.ts) that's admin and doctor only, not nurse
// or lab_technician, who have read/write but not create on clinical_notes.
router.post(
  "/",
  requireClinicalNotesCreate,
  expressAsyncHandler(async (req, res) => {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ message: "Please provide a question" });
      return;
    }
    const answer = await askMedicalQuestion(question);
    res.status(201).json({ answer });
  }),
);

export default router;
