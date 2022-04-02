const mongoose = require('mongoose');
const Service = require("../models/Service.js");
 
exports.getAll = async (req, res) => {
  try {
    const services = await Service.find();

    res.status(200).json(services);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 
exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);

    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { name, description, charge, main_purpose, updated_date } = req.body;

  const newService = new Service({ name, description, charge, main_purpose, updated_date });

  try {
    await newService.save();

    res.status(201).json(newService);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description, charge, main_purpose, updated_date } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No service with id: ${id}`);

  const updatedService = { name, description, charge, main_purpose, updated_date, _id: id };

  await Service.findByIdAndUpdate(id, updatedService, { new: true });

  res.json(updatedService);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No service with id: ${id}`);

  await Service.findByIdAndRemove(id);

  res.json({ message: "Service deleted successfully." });
};
