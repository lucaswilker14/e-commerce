import { Router } from 'express';
import ClientController from '../../components/client/controller';
import { isAdmin } from '../store/storeValidation'
import { index
    , searchOrders
    , searchClient
    , getAdmin
    , getAllOrderClients
    , updateAdmin
    , getClient
    , createInStore
    , updateClient

} from './clientValidation'
import { createValidator } from "express-joi-validation";
import auth from '../../auth/auth';

const router            = Router();
const clientController  = new ClientController();
const validator         = createValidator({passError: true});


//admin
router.get('/', auth.required, isAdmin, validator.query(index), clientController.index);

router.get('/search/:search', auth.required, isAdmin, validator.query(searchClient.query),
    validator.params(searchClient.params), clientController.searchClient);

router.get('/admin/:id', auth.required, isAdmin, validator.params(getAdmin), clientController.getAdmin);

router.put('/admin/:id', auth.required, isAdmin, validator.params(updateAdmin.params),
    validator.body(updateAdmin.body), clientController.updateAdmin);

//client
router.get('/:id', auth.required, validator.query(getClient), clientController.getClient);

router.post('/', validator.query(createInStore.query),
    validator.body(createInStore.body), clientController.createInStore);

router.put('/:id', auth.required, validator.query(updateClient.query),
    validator.params(updateClient.params), validator.body(updateClient.body), clientController.updateClient);

router.delete('/:id', auth.required, clientController.removeClient);


module.exports = router;