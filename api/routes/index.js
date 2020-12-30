import { Router } from 'express';
import userRoutes from '../components/user/routes'
import storeRoutes from '../components/store/routes'
import clientRoutes from '../components/client/routes'
import categoryRoutes from '../components/category/routes'

const router = Router();

router.use('/usuario', userRoutes);
router.use('/lojas', storeRoutes);
router.use('/clientes', clientRoutes);
router.use('/categorias', categoryRoutes);

module.exports = router;