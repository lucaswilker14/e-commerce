import { Router } from 'express';
import auth from '../../routes/auth';
import StoreController from '../../components/store/controller';

const router = Router();
const storeController   = new StoreController();

router.get('/', storeController.index);
router.get('/:id', storeController.getStoreById);

router.post('/', auth.required, storeController.store);

router.put('/:id', auth.required, storeController.update);

router.delete('/:id', auth.required, storeController.remove);


module.exports = router;