import {Router} from "express"
import {
    create,
    getAll,
    update,
    single,
    deleteFinancial,
  } from "../../controllers/financialController";


const router = Router();
// Retrieve all financials
router.get('/', getAll);

// Create a new financial
router.post('/', create);

// Retrieve a single financial with id
router.get('/:id', single);

// Update a financial with id
router.patch('/:id', update);

// Delete a financial with id
router.delete('/:id', deleteFinancial);

export default router;  