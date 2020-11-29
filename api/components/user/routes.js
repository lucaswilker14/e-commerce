const router = require('express').Router();
const auth = require('/api/routes/auth');
const userController = new UserController();

// get routes
router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.getUserById);

// post routes
router.post('/login', userController.login());
router.post('registrar', userController.registerUser);

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