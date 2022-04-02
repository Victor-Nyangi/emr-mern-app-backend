const express = require("express");
const router = express.Router();
const Patient = require("../../controllers/patient");

// Retrieve all members
router.get("/", Patient.getAll);

// Create a new member
router.post("/", Patient.create);

// Retrieve a single member with id
router.get("/:id", Patient.single);

// Update a member with id
router.patch("/:id", Patient.update);

// Delete a member with id
router.delete("/:id", Patient.delete);

module.exports = router;
