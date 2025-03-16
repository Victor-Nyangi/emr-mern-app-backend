const mongoose = require("mongoose");
const Patient = require("../models/Patient.js");

exports.getAll = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id);

    res.status(200).json(patient);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const {
    first_name,
    last_name,
    address,
    phone_number,
    email,
    date_of_birth,
    gender,
    marital_status,
    education_level,
    income_level,
    occupation,
    size_of_family,
    emergency_contact,
    salutation,
    height,
    weight,
    blood_group,
    underlying_conditions,
    updated_date,
    is_active,
  } = req.body;

  const newPatient = new Patient({
    first_name,
    last_name,
    address,
    phone_number,
    email,
    date_of_birth,
    gender,
    marital_status,
    education_level,
    income_level,
    occupation,
    size_of_family,
    emergency_contact,
    salutation,
    height,
    weight,
    blood_group,
    underlying_conditions,
    updated_date,
    is_active,
  });

  try {
    await newPatient.save();

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    address,
    phone_number,
    email,
    date_of_birth,
    gender,
    marital_status,
    education_level,
    income_level,
    occupation,
    size_of_family,
    emergency_contact,
    salutation,
    height,
    weight,
    blood_group,
    underlying_conditions,
    updated_date,
    is_active,
  } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No patient with id: ${id}`);

  const updatedPatient = {
    first_name,
    last_name,
    address,
    phone_number,
    email,
    date_of_birth,
    gender,
    marital_status,
    education_level,
    income_level,
    occupation,
    size_of_family,
    emergency_contact,
    salutation,
    height,
    weight,
    blood_group,
    underlying_conditions,
    updated_date,
    is_active,
    _id: id,
  };

  await Patient.findByIdAndUpdate(id, updatedPatient, { new: true });

  res.json(updatedPatient);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No patient with id: ${id}`);

  await Patient.findByIdAndRemove(id);

  res.json({ message: "Patient deleted successfully." });
};
