import { Router } from 'express';
import userRoutes from '../components/user/routes'
import storeRoutes from '../components/store/routes'
import clientRoutes from '../components/client/routes'
import categoryRoutes from '../components/category/routes'
import productRoutes from '../components/products/routes'

const router = Router();

router.use('/usuario', userRoutes);
router.use('/lojas', storeRoutes);
router.use('/clientes', clientRoutes);
router.use('/categorias', categoryRoutes);
router.use('/produtos', productRoutes);

module.exports = router;