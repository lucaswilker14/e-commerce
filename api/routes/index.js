const router = require('express').Router();
const userRoutes = require('../components/user/routes')

router.use('/usuario', userRoutes);

module.exports = router;