const router = require('express').Router();
const userRoutes = require('../components/user/routes');
const storeRoutes = require('../components/store/routes');

router.use('/usuario', userRoutes);
router.use('/loja', storeRoutes);

module.exports = router;