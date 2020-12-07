import { Router } from 'express';
import ClientController from '../../components/client/controller';
import { isAdmin, getStoreById, registerStore, update } from '../store/storeValidation'
import { isAdmin, getStoreById, registerStore, update } from './clientValidation'
import { createValidator } from "express-joi-validation";
import auth from '../../auth/auth';

const router            = Router();
const clientController  = new ClientController();
const validator         = createValidator({passError: true});


//admin
router.get('/', auth.required, isAdmin, clientController.index);
// router.get('/buscar/:id/pedidos', auth.required, isAdmin, clientController.searchOrders);
router.get('/buscar/:id', auth.required, isAdmin, clientController.searchClient);
router.get('/admin/:id', auth.required, isAdmin, clientController.getAdmin);
// router.get('/admin/:id/:pedidos', auth.required, isAdmin, clientController.getAllOrderClients);

router.put('/admin/:id', auth.required, isAdmin, clientController.update);

//client
router.get('/:id', auth.required, clientController.getClient);

router.post('/', clientController.createInStore);
router.put('/:id', auth.required, clientController.update);
router.delete('/:id', auth.required, clientController.remove);


module.exports = router;