import { Router } from 'express'
import CategoryController from './controller';
import { isAdmin } from '../store/storeValidation'
import { createValidator } from "express-joi-validation";
import auth from '../../auth/auth';
import { index, getAvailable, getAvailableByID, createCategory, update, remove } from './categoryValidation';

const router                = Router();
const categoryController    = new CategoryController();
const validator             = createValidator({passError: true});

router.get('/', validator.query(index), categoryController.index);
router.get('/disponiveis', validator.query(getAvailable), categoryController.getAvailable);
router.get('/:id', validator.query(getAvailableByID.query), validator.params(getAvailableByID.params),
    categoryController.getCategoryByID);

router.post('/', auth.required, isAdmin, validator.body(createCategory), categoryController.createCategory);

router.put('/:id', auth.required, isAdmin, validator.body(update.body), validator.params(update.params),
    categoryController.update);

router.delete('/:id', auth.required, isAdmin, validator.params(remove), categoryController.remove);

module.exports = router;