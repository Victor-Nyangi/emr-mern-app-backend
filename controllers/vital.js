const mongoose = require("mongoose");
const Vital = require("../models/Vital.js");

exports.getAll = async (req, res) => {
  try {
    const vitals = await Vital.find();

    res.status(200).json(vitals);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const vital = await Vital.findById(id);

    res.status(200).json(vital);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const {
    patient_name,
    body_temperature,
    pulse_rate,
    respiration_rate,
    blood_pressure,
    overall_status,
    date_created,
    weight,
    blood_glucose,
    health_status,
    updated_date,
  } = req.body;

  const newVital = new Vital({
    patient_name,
    body_temperature,
    pulse_rate,
    respiration_rate,
    blood_pressure,
    overall_status,
    date_created,
    weight,
    blood_glucose,
    health_status,
    updated_date,
  });

  try {
    await newVital.save();

    res.status(201).json(newVital);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    patient_name,
    body_temperature,
    pulse_rate,
    respiration_rate,
    blood_pressure,
    overall_status,
    date_created,
    weight,
    blood_glucose,
    health_status,
    updated_date,
  } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No vital with id: ${id}`);

  const updatedVital = {
    patient_name,
    body_temperature,
    pulse_rate,
    respiration_rate,
    blood_pressure,
    overall_status,
    date_created,
    weight,
    blood_glucose,
    health_status,
    updated_date,
    _id: id,
  };

  await Vital.findByIdAndUpdate(id, updatedVital, { new: true });

  res.json(updatedVital);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No vital with id: ${id}`);

  await Vital.findByIdAndRemove(id);

  res.json({ message: "Vital deleted successfully." });
};
