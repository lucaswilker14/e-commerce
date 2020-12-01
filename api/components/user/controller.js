const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const sendRecoveryEmail = require('../../helpers/email-recovery');

class UserController {

    /**
     * return user data logged into the store
     */
    index(req, res, next) {
        userModel.findById(req.payload.id).then(user => {
            if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
            return res.json({usuario: user.getUserDecrypt()})
        }).catch(next);
    };


    /**
     * return user by ID
     */
    getUserById(req, res, next) {
        userModel.findById(req.params.id).then(user => {
            if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
            return res.json({ usuario: {nome:   user.name,
                                        email:  user.email,
                                        role:   user.role,
                                        loja:   user.store}});
        }).catch(next);
    }


    /**
     * Login in store
     */
    login(req, res, next) {
        const { email, password } = req.body;
        if(!email) return res.status(422).json({errors: {email: "Email não pode ficar vazio"}});
        if(!password) return res.status(422).json({errors: {email: "Senha não pode ficar vazio"}});
        userModel.findOne({email}).then((user) => {
            if(!user) return res.status(422).json({errors: {email: "Usuário não está cadastrado"}});
            if(!user.validatePassword(password)) return res.status(422).json({errors: {email: "Senha Inválida"}});
            return res.json({usuario: user.getUserDecrypt()});
        }).catch(next)
    };


    /**
     * register new user in store
     */
    registerUser(req, res, next) {
        const { name, email, password, store } = req.body;

        if(!name || !email || !password || !store) return res.status(422).json({errors: "Preencha os campos de cadastro!"})

        const new_user = new userModel({ name, email, store });
        new_user.encryptPassword(password)
        new_user.save()
            .then(() => res.json({usuario: new_user.getUserDecrypt()}))
            .catch(next)
    };


    /**
     * PUT in root '/'
     *  update user in the store
     */
    update(req, res, next) {
        const { name, email, password } = req.body;
        userModel.findById(req.payload._id).then(user => {
            if (!user) return res.status(401).json({errors: 'Usuário não cadastrado!'});
            if (typeof name !== 'undefined') user.name = name;
            if (typeof email !== 'undefined') user.email = email;
            if (typeof password !== 'undefined') user.name = password;

            return userModel.save().then(() => {
               return res.json({usuario: userModel.getUserDecrypt()});
            }).catch(next);
        }).catch(next);
    };


    /**
     * Remove user in the store
     */
    removeUser(req, res, next) {
        const id = req.payload._id;
        userModel.findByIdAndRemove(id).then(() => {
            res.json({message: 'Sua conta foi excluida!'});
        }).catch(next);
    };


    /**
     * Return view to recovery
     */
    showRecovery(req, res, next) {
        return res.render('recovery', {error: null, success: null});
    };


    /**
     * POST to recovery password
     */
    createRecovery(req, res, next) {
        const { email } = req.body;
        if(!email) return res.render("recovery", {errros: "Preencha com seu email", success: null})

        userModel.findOne({ email }).then((user) => {
            if(!user) return res.render("recovery", {errros: "Usuário não cadastrado", success: null})
            const recoveryData = userModel.recoveryPassword();
            return user.save().then(() => {
                return res.render('recovery', {error: null, success: true});
                // sendRecoveryEmail({user, recovery: recoveryData}, (error = null, success = null) => {
                //     return res.render("recovery", {error, success});
                // });
            }).catch(next)
        }).catch(next)
    };


    /**
     * GET Show view to recovery password
     */
    showFinishRecovery(req, res, next) {
        if(!req.query.token) return res.render('recovery', {error: "Token não identificado", success: null});

        userModel.findOne({"recovery.token": req.query.token}).then((user) => {
            if(!user) return res.render("recovery", {error: "Não existe usuário com esse token", success: null});
            if(new Date(user.recovery.date) < new Date()) return res.render("recovery", {error: "Token expirado", success: null});
            return res.render('recovery/store', {error: null, success: null, token: req.query.token});
        }).catch(next);
    };


    /**
     *
     */
    finishRecovery(req, res, next) {
        const {token, password} = req.body;
        if(!token || !password) return res.render('recovery/store', {   error: "Preencha novamente com sua nova senha",
                                                                        success: null});
        userModel.findOne({ "recovery.token": token }).then((user) => {
            if(!user) return res.render("recovery", {error: "Usuário não identificado", success: null});
            userModel.resetToken();
            userModel.encryptPassword(password);
            return userModel.save().then(() => {
                return res.render("recovery/store", {   error: null,
                                                        success: "Senha alterada com Sucesso",
                                                        token: null });
            }).catch(next);
        }).catch(next);
    }
}

module.exports = UserController;