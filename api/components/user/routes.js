const router = require('express').Router();
const auth = require('../../routes/auth');
const UserController = require('../user/controller')
const userController = new UserController();


router.post('/cadastro', userController.registerUser);
router.post('/login', userController.login);

router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.getUserById);

router.put('/', auth.required, userController.update)

router.delete('/', auth.required, userController.removeUserAccount);

// password recovery
router.get('/recuperar-senha', userController.showRecovery);
router.get('/senha-recuperada', userController.showFinishRecovery)
router.post('/recuperar-senha', userController.createRecovery);
router.post('/senha-recuperada', userController.finishRecovery);


module.exports = router;