const router = require('express').Router();
const auth = require('/api/routes/auth');
//user controller here

// get routes
router.get('/', auth.required, userController.index);
router.get('/:id', auth.required, userController.getUser);
router.get('/recuperar-senha', userController.showRecovery);
router.get('/senha-recuperada', userController.showFinishRecovery)

// post routes
router.post('/login', userController.login());
router.post('registrar', userController.register);
router.post('/recuperar-senha', userController.createRecovery);
router.post('/senha-recuperada', userController.finishRecovery);

// put routes
router.put('/', auth.required, userController.update)

// delete routes
router.delete('/', auth.required, userController.deleteAccount);

module.exports = router;