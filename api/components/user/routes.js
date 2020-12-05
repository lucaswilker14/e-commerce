import { Router } from 'express';
import auth  from '../../auth/auth';
import {  getByIdValidator
        , registerUserValidator
        , loginValidator
        , updateUserValidator } from './userValidation';
import { createValidator } from 'express-joi-validation';
import UserController from '../user/controller';

const router = Router();
const validator = createValidator({passError: true});
const userController = new UserController();


router.post('/cadastro', validator.body(registerUserValidator), userController.signup);
router.post('/login', validator.body(loginValidator), userController.login);

router.put('/', auth.required, validator.body(updateUserValidator), userController.update)

router.delete('/', auth.required, userController.removeUserAccount);

// password recovery
router.get('/recuperar-senha', userController.showRecovery);
router.post('/recuperar-senha', userController.createRecovery);
router.get('/senha-recuperada', userController.showFinishRecovery)
router.post('/senha-recuperada', userController.finishRecovery);

router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, validator.params(getByIdValidator), userController.getUserById);


module.exports = router;