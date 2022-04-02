const express = require('express')
const router = express.Router()
const Vital = require('../../controllers/vital');

// Retrieve all members
router.get('/', Vital.getAll);

// Create a new member
router.post('/', Vital.create);

// Retrieve a single member with id
router.get('/:id', Vital.single);

// Update a member with id
router.patch('/:id', Vital.update);

// Delete a member with id
router.delete('/:id', Vital.delete);

module.exports = router   