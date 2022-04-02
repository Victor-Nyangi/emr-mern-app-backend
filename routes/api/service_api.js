const express = require('express')
const router = express.Router()
const Service = require('../../controllers/service');

// Retrieve all members
router.get('/', Service.getAll);

// Create a new member
router.post('/', Service.create);

// Retrieve a single member with id
router.get('/:id', Service.single);

// Update a member with id
router.patch('/:id', Service.update);

// Delete a member with id
router.delete('/:id', Service.delete);
  
module.exports = router  