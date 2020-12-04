import { Router } from 'express';
import userRoutes from '../components/user/routes'
import storeRoutes from '../components/store/routes'

const router = Router();

router.use('/usuario', userRoutes);
router.use('/lojas', storeRoutes);

module.exports = router;