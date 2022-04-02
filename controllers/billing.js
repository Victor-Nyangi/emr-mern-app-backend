const mongoose = require("mongoose");
const Billing = require("../models/Billing.js");

exports.getAll = async (req, res) => {
  try {
    const billings = await Billing.find();

    res.status(200).json(billings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const billing = await Billing.findById(id);

    res.status(200).json(billing);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const {
    patient_name,
    service_charged,
    explanation,
    amount,
    date_created,
    updated_date,
  } = req.body;

  const newBilling = new Billing({
    patient_name,
    service_charged,
    explanation,
    amount,
    date_created,
    updated_date,
  });

  try {
    await newBilling.save();

    res.status(201).json(newBilling);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    patient_name,
    service_charged,
    explanation,
    amount,
    date_created,
    updated_date,
  } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No billing with id: ${id}`);

  const updatedBilling = {
    patient_name,
    service_charged,
    explanation,
    amount,
    date_created,
    updated_date,
    _id: id,
  };

  await Billing.findByIdAndUpdate(id, updatedBilling, { new: true });

  res.json(updatedBilling);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No billing with id: ${id}`);

  await Billing.findByIdAndRemove(id);

  res.json({ message: "Billing deleted successfully." });
};
