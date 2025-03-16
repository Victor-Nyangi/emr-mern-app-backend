const express = require('express')
const router = express.Router()
const Member = require('../../controllers/member');

// Retrieve all members
router.get('/', Member.getAll);

// Create a new member
router.post('/', Member.create);

// Retrieve a single member with id
router.get('/:id', Member.single);

// Update a member with id
router.patch('/:id', Member.update);

// Delete a member with id
router.delete('/:id', Member.delete);

module.exports = router  