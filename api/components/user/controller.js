const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const sendRecoveryEmail = require('/api/helpers');

class UserController {

    index(req, res, next) {
        userModel.findById(req.payload.id).then(user => {
            if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
            return res.json({usuario: user.getToken()})
        }).catch(next);
    };

    getUserById(req, res, next) {
        userModel.findById(req.params.id).then(user => {
            if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
            return res.json({usuario: {nome: user.name, email: user.email, role: user.role, loja: user.store}});
        }).catch(next);
    }

    login(req, res, next) {
        const { email, password } = req.body;
        if(!email) return res.status(422).json({errors: {email: "Email não pode ficar vazio"}});
        if(!password) return res.status(422).json({errors: {email: "Senha não pode ficar vazio"}});
        userModel.findOne({email}).then((user) => {
            if(!email) return res.status(422).json({errors: {email: "Usuário não está cadastrado"}});
            if(!user.validatePassword(password)) return res.status(422).json({errors: {email: "Senha Inválida"}});
            return res.json({usuario: user.getToken()});
        }).catch(next)
    };

    registerUser(req, res, next) {
        const {nome, email, password } = req.body;
        if(!nome || !email || !password) return res.status(422).json({errors: "Preencha os campos de cadastro!"})
        const new_user = new userModel({nome, email, password});
        new_user.encryptPassword(password)
        new_user.save()
            .then(() => res.json({usuario: new_user.getToken()}))
            .catch(next)
    };

    update(req, res, next) {
        const {nome, email, password } = req.body;
        userModel.update({name: nome}, {email: email}, {password: password}).then((user) => {
            return user.save().then(() => {
                return res.json({usuario: userModel.getToken()});
            }).catch(next);
        }).catch(next);
    };

    removeUser(req, res, next) {
        const id = req.payload.id;
        userModel.findByIdAndRemove({_id: id}).then(() => {
            res.json({message: 'Sua conta foi excluida!'});
        }).catch(next);
    };

    showRecovery(req, res, next) {
        return res.render('recovery', {error: null, success: null});
    };

    showFinishRecovery(req, res, next) {
        if(!req.query.token) return res.render('recovery', {error: "Token não identificado", success: null});
        userModel.findOne({"recovery.token": req.query.token}).then((user) => {
            if(!user) return res.render("recovery", {error: "Não existe usuário com esse token", success: null});
            if(new Date(user.recovery.date) < new Date()) return res.render("recovery", {error: "Token expirado", success: null});
            return res.render('recovery/store', {error: null, success: null, token: req.query.token});
        }).catch(next);
    };

    createRecovery(req, res, next) {
        const {email} = req.body;
        if(!email) return res.render("recovery", {errros: "Preencha com seu email", success: null})

        userModel.findOne({email}).then((user) => {
            if(!user) return res.render("recovery", {errros: "Usuário não cadastrado", success: null})
            const recoveryData = userModel.recoveryPassword();
            return user.save().then(() => {
                // return res.render('recovery', {error: null, success: true});
                sendRecoveryEmail({user, recovery: recoveryData}, (error = null, success = null) => {
                    return res.render("recovery", {error, success});
                });
            }).catch(next)
        }).catch(next)
    };

    finishRecovery(req, res, next) {
        const {token, password} = req.body;
        if(!token || !password) return res.render('recovery/store',
            {error: "Preencha novamente com sua nova senha", success: null});
        userModel.findOne({"recovery.token": token}).then((user) => {
            if(!user) return res.render("recovery", {error: "Usuário não identificado", success: null});
            userModel.finishToken();
            userModel.encryptPassword(password);
            return userModel.save().then(() => {
                return res.render("recovery/store", { error: null, success: "Senha alterada com Sucesso", token: null })
            }).catch(next)
        }).catch(next)
    }
}