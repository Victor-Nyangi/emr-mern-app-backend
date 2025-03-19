import { Router } from "express";
import { getAll, create, single, update, deleteMember } from "../../controllers/memberController";


const router = Router();
// Retrieve all members
router.get('/', getAll);

// Create a new member
router.post('/', create);

// Retrieve a single member with id
router.get('/:id', single);

// Update a member with id
router.patch('/:id', update);

// Delete a member with id
router.delete('/:id', deleteMember);

export default router 