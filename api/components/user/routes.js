import { Router } from 'express';
import auth  from '../../routes/auth';
import UserController from '../user/controller'

const router = Router();
const userController = new UserController();


router.post('/cadastro', userController.registerUser);
router.post('/login', userController.login);

router.put('/', auth.required, userController.update)

router.delete('/', auth.required, userController.removeUserAccount);

// password recovery
router.get('/recuperar-senha', userController.showRecovery);
router.post('/recuperar-senha', userController.createRecovery);
router.get('/senha-recuperada', userController.showFinishRecovery)
router.post('/senha-recuperada', userController.finishRecovery);

router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.getUserById);


module.exports = router;