const mongoose = require('mongoose');
const Member = require("../models/Member.js");

exports.getAll = async (req, res) => {
  try {
    const members = await Member.find();

    res.status(200).json(members);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 
exports.single = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id);

    res.status(200).json(member);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    address,
    phone_number,
    email,
    gender,
    salutation,
    department,
    role,
    is_active,
    updated_date,
  } = req.body;

  const newMember = new Member({
    first_name,
    last_name,
    date_of_birth,
    address,
    phone_number,
    email,
    gender,
    salutation,
    department,
    role,
    is_active,
    updated_date,
  });

  try {
    await newMember.save();

    res.status(201).json(newMember);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    date_of_birth,
    address,
    phone_number,
    email,
    gender,
    salutation,
    department,
    role,
    is_active,
    updated_date,
  } = req.body;

  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required fields",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No member with id: ${id}`);

  const updatedMember = { name, description, manufacter_date, expiry_date, updated_date, _id: id };

  await Member.findByIdAndUpdate(id, updatedMember, { new: true });

  res.json(updatedMember);
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No member with id: ${id}`);

  await Member.findByIdAndRemove(id);

  res.json({ message: "Member deleted successfully." });
};
