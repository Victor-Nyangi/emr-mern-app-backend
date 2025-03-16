const mongoose = require("mongoose");
const Financial = require("../models/Financial.js");

exports.getAll = async (req, res) => {
  try {
    const financials = await Financial.find();

    res.status(200).json(financials);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const financial = await Financial.findById(id);

    res.status(200).json(financial);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const {
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
  } = req.body;

  const newFinancial = new Financial({
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
  });

  try {
    await newFinancial.save();

    res.status(201).json(newFinancial);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
  } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No financial with id: ${id}`);

  const updatedFinancial = {
    patient_name,
    account_name,
    account_number,
    account_type,
    updated_date,
    _id: id,
  };

  await Financial.findByIdAndUpdate(id, updatedFinancial, { new: true });

  res.json(updatedFinancial);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No financial with id: ${id}`);

  await Financial.findByIdAndRemove(id);

  res.json({ message: "Financial deleted successfully." });
};
