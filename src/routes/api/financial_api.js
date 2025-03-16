const express = require('express')
const router = express.Router()
const Financial = require('../../controllers/financial');

// Retrieve all members
router.get('/', Financial.getAll);

// Create a new member
router.post('/', Financial.create);

// Retrieve a single member with id
router.get('/:id', Financial.single);

// Update a member with id
router.patch('/:id', Financial.update);

// Delete a member with id
router.delete('/:id', Financial.delete);

module.exports = router   