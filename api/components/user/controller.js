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

    registerUser(req, res, next) {
        const {nome, email, password } = req.body;
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

    login(req, res, next) {
        const { email, password } = req.body;
        if(!email) return res.status(422).json({errors: {email: "Email não pode ficar vazio"}});
        if(!password) return res.status(422).json({errors: {email: "Senha não pode ficar vazio"}});
        userModel.findOne({email}).then((user) => {
            if(!email) return res.status(422).json({errors: {email: "Usuário não está cadastrado"}});
            if(!user.validatePassword(password)) return res.status(422).json({errors: {email: "Senha Inválida"}});
            return res.json({usuario: user.getToken()});
        }).catch(next)
    }
}