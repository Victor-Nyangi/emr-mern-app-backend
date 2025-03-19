import {Router} from "express"
import {
    create,
    getAll,
    update,
    single,
    deleteFinancial,
  } from "../../controllers/financialController";


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
router.delete('/:id', deleteFinancial);

export default router;  