const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const sendEmailRecovery = require('../../helpers/email-recovery');
const recovery_view = '../api/components/user/views/recovery.ejs'
const recoveryStore_view = '../api/components/user/views/store.ejs'
import responses from '../util/http-responses'

class UserController {

    /**
     * return users datas logged into the store
     */
    index(req, res, next) {
        userModel.findById(req.payload._id).then(user => {
            if(!user) return res.status(responses.unauthorized({error: "Usuário não cadastrado!"}));
            return res.json({user: user.getUserDecrypt()})
        }).catch(next);
    };

    getUserById(req, res, next) {
        userModel.findById(req.params.id).then(user => {
            if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
            return res.json({ user: {nome:   user.name,
                                        email:  user.email,
                                        role:   user.role,
                                        loja:   user.store}});
        }).catch(next);
    }

    login(req, res, next) {
        const { email, password } = req.body;
        if(!email) return res.status(422).json({errors: {email: "Email não pode ficar vazio"}});
        if(!password) return res.status(422).json({errors: {email: "Senha não pode ficar vazio"}});
        userModel.findOne({email}).then((user) => {
            if(!user) return res.status(422).json({errors: {email: "Usuário não está cadastrado"}});
            if(!user.validatePassword(password)) return res.status(422).json({errors: {email: "Senha Inválida"}});
            return res.json({user: user.getUserDecrypt()});
        }).catch(next)
    };

    registerUser(req, res, next) {
        const { name, email, password, store } = req.body;
        if(!name || !email || !password || !store) return res.status(422).json({errors: "Preencha os campos de cadastro!"})
        const new_user = new userModel({ name, email, store });
        new_user.encryptPassword(password)
        new_user.save()
            .then(() => res.json({user: new_user.getUserDecrypt()}))
            .catch(next)
    };

    update(req, res, next) {
        const { name, email, password } = req.body;
        userModel.findById(req.payload._id).then(user => {
            if (!user) return res.status(401).json({errors: 'Usuário não cadastrado!'});
            if (typeof name !== 'undefined') user.name = name;
            if (typeof email !== 'undefined') user.email = email;
            if (typeof password !== 'undefined') user.name = password;

            return user.save().then(() => {
               return res.json({user: user.getUserDecrypt()});
            }).catch(next);
        }).catch(next);
    };

    removeUserAccount(req, res, next) {
        const id = req.payload._id;
        userModel.findByIdAndRemove(id).then(user => {
            if(!user) return res.status(404).json({error: "Usuário não cadastrado"})
            res.json({message: 'Sua conta foi excluida!'});
        }).catch(next);
    };

    /**
     * Return view to recovery
     */
    showRecovery(req, res, next) {
        return res.render(recovery_view, {error: null, success: null});
    };

    /**
     * POST to recovery password
     */
    createRecovery(req, res, next) {
        const { email } = req.body;
        if(!email) return res.render(recovery_view, {error: "Preencha com seu email", success: null})
        userModel.findOne({ email }).then((user) => {
            if(!user) return res.render(recovery_view, {error: "Usuário não cadastrado", success: null})
            const recoveryData = user.recoveryPassword();
            return user.save().then(() => {
                sendEmailRecovery({user, recovery: recoveryData}, (error = null, success = null) => {
                    return res.render(recovery_view, {error, success});
                });
            }).catch(next)
        }).catch(next)
    };

    /**
     * GET Show view to recovery password
     */
    showFinishRecovery(req, res, next) {
        if(!req.query.token) return res.render(recovery_view, {error: "Token não identificado", success: null});
        userModel.findOne({"recovery.token": req.query.token}).then((user) => {
            if(!user) return res.render(recovery_view, {error: "Não existe usuário com esse token", success: null});
            if(new Date(user.recovery.date) < new Date()) return res.render(recovery_view, {error: "Token expirado", success: null});
            return res.render(recoveryStore_view, {error: null, success: null, token: req.query.token});
        }).catch(next);
    };

    /**
     * Updates the new password after the recovery password
     */
    finishRecovery(req, res, next) {
        const { token, password } = req.body;

        if(!token || !password) return res.render(recoveryStore_view,
            {error: "Preencha novamente com sua nova senha", success: null});

        userModel.findOne({ "recovery.token": token }).then((user) => {
            if(!user) return res.render(recovery_view, {error: "Usuário não identificado", success: null});
            user.resetToken();
            user.encryptPassword(password);
            return user.save().then(() => {
                return res.render(recoveryStore_view, {   error: null,
                                                        success: "Senha alterada com Sucesso",
                                                        token: null });
            }).catch(next);
        }).catch(next);
    }

}

module.exports = UserController;