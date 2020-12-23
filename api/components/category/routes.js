import { } from 'express'
import CategoryController from './controller';
import { isAdmin } from '../store/storeValidation'
import { createValidator } from "express-joi-validation";
import auth from '../../auth/auth';

const router            = Router();
const categoryController  = new CategoryController();
const validator         = createValidator({passError: true});

router.get('/', categoryController.index);
router.get('/disponiveis', categoryController.getAvailability);
router.get('/:id', categoryController.getCategoryByID);

router.post('/', auth.required, isAdmin, categoryController.createCategory);

router.put('/:id', auth.required, isAdmin, categoryController.update);

router.delete('/:id', auth.required, isAdmin, categoryController.delete);

module.exports = router;