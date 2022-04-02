const express = require('express')
const router = express.Router()
const Drug = require('../../controllers/drug');

// Retrieve all members
router.get('/', Drug.getAll);

// Create a new member
router.post('/', Drug.create);

// Retrieve a single member with id
router.get('/:id', Drug.single);

// Update a member with id
router.patch('/:id', Drug.update); 

// Delete a member with id
router.delete('/:id', Drug.delete);

module.exports = router   