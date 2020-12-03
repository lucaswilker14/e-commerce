import { Router } from 'express';
import auth from '../../auth/auth';
import storeValidation from './storeValidation'
import StoreController from '../../components/store/controller';

const router          = Router();
const storeController = new StoreController();

router.get('/', storeController.index);
router.get('/:id', storeController.getStoreById);

router.post('/', auth.required, storeValidation, storeController.registerStore);

router.put('/:id', auth.required, storeValidation, storeController.update);

router.delete('/:id', auth.required, storeValidation, storeController.remove);


module.exports = router;