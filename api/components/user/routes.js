const router = require('express').Router();
const auth = require('../../routes/auth');
const UserController = require('../user/controller')
const userController = new UserController();


// post routes
router.post('/cadastro', userController.registerUser);
router.post('/login', userController.login);

// get routes
router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.getUserById);

// put routes
router.put('/', auth.required, userController.update)

// delete routes
router.delete('/', auth.required, userController.removeUser);

// password recovery
router.get('/recuperar-senha', userController.showRecovery);
router.get('/senha-recuperada', userController.showFinishRecovery)
router.post('/recuperar-senha', userController.createRecovery);
router.post('/senha-recuperada', userController.finishRecovery);



module.exports = router;