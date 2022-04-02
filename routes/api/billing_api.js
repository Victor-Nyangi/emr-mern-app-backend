const express = require('express')
const router = express.Router()
const Billing = require('../../controllers/billing');

// Retrieve all members
router.get('/', Billing.getAll);

// Create a new member
router.post('/', Billing.create);

// Retrieve a single member with id
router.get('/:id', Billing.single);

// Update a member with id
router.patch('/:id', Billing.update);

// Delete a member with id
router.delete('/:id', Billing.delete);

module.exports = router   