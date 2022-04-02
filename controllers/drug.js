const mongoose = require('mongoose');
const Drug = require("../models/Drug.js");

exports.getAll = async (req, res) => {
  try {
    const drugs = await Drug.find();

    res.status(200).json(drugs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 
exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const drug = await Drug.findById(id);

    res.status(200).json(drug);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { name, description, manufacter_date, expiry_date, updated_date } = req.body;

  const newDrug = new Drug({ name, description, manufacter_date, expiry_date, updated_date });

  try {
    await newDrug.save();

    res.status(201).json(newDrug);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description, manufacter_date, expiry_date, updated_date } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No drug with id: ${id}`);

  const updatedDrug = { name, description, manufacter_date, expiry_date, updated_date, _id: id };

  await Drug.findByIdAndUpdate(id, updatedDrug, { new: true });

  res.json(updatedDrug);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No drug with id: ${id}`);

  await Drug.findByIdAndRemove(id);

  res.json({ message: "Drug deleted successfully." });
};
