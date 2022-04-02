const express = require('express')
const router = express.Router()
const Department = require('../../controllers/department');

// Retrieve all members
router.get('/', Department.getAll);

// Create a new member
router.post('/', Department.create);

// Retrieve a single member with id
router.get('/:id', Department.single);

// Update a member with id
router.patch('/:id', Department.update);

// Delete a member with id
router.delete('/:id', Department.delete);

module.exports = router   