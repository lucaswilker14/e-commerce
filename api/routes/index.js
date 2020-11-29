const router = require('express').Router();
const userRoutes = require('/api/components/user/routes')

router.use('/usuarios', userRoutes);

module.exports = router;