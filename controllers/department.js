const mongoose = require('mongoose');
const Department = require("../models/Department.js");

exports.getAll = async (req, res) => {
  try {
    const departments = await Department.find();

    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 
exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findById(id);

    res.status(200).json(department);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { name, description, updated_date } = req.body;

  const newDepartment = new Department({ name, description, updated_date });

  try {
    await newDepartment.save();

    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description, updated_date } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No department with id: ${id}`);

  const updatedDepartment = { name, description, updated_date, _id: id };

  await Department.findByIdAndUpdate(id, updatedDepartment, { new: true });

  res.json(updatedDepartment);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No department with id: ${id}`);

  await Department.findByIdAndRemove(id);

  res.json({ message: "Department deleted successfully." });
};
