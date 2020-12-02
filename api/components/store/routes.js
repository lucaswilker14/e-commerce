const router            = require('express').Router();
const auth              = require('../../routes/auth');
const StoreController   = require('../store/controller')
const storeController   = new StoreController();

router.get('/', storeController.index);
router.get('/:id', storeController.getStoreById);

router.post('/', auth.required, storeController.store);

router.put('/:id', auth.required, storeController.update);

router.delete('/:id', auth.required, storeController.remove);


module.exports = router;