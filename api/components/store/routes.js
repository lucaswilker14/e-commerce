import { Router } from 'express';
import StoreController from '../../components/store/controller';
import auth from '../../auth/auth';
import { isAdmin, getStoreById, registerStore, update } from './storeValidation'
import { createValidator} from "express-joi-validation";


const router          = Router();
const storeController = new StoreController();
const validator = createValidator({passError: true});


router.post('/', auth.required, validator.body(registerStore), storeController.registerStore);

router.put('/:id', auth.required, isAdmin, validator.body(update), storeController.update);

router.delete('/:id', auth.required, isAdmin, storeController.remove);

router.get('/', storeController.index);
router.get('/:id', validator.params(getStoreById), storeController.getStoreById);


module.exports = router;