import { model } from 'mongoose';
import sendEmailRecovery from '../../helpers/email-recovery';
import { compare } from 'bcrypt'

const recovery_view = '../views/recovery.ejs';
const recovery_store_view = '../views/store.ejs';

const userModel = model('User');

class UserController {

    async signup(req, res, next) {
        const { name, email, password, store } = req.body;
        const new_user = new userModel({ name, email, password, store });
        await new_user.save()
            .then(() => res.json({user: new_user.getModelUser(), message: "Cadastro Realizado com Sucesso!"}))
            .catch(next);
    };

    async login(req, res, next) {
        const { email, password } = req.body;
        await userModel.findOne({ email }).select('+password').then(async user =>  {
            if (!user) return res.send({error: 'Usuário não encontrado!'}).status(404);
            if (!await compare(password, user.password)) return res.send({error: "Senha Inválida"}).status(400);
            const token = user.generateUserToken()
            return res.send({user: user.getModelUser(), token});
        });
    };

    async update(req, res, next) {
        const { name, email, password } = req.body;
        await userModel.findById(req.payload._id).select('+password').then(user => {
            if (!user) return res.status(401).json({errors: 'Usuário não cadastrado!'});
            if (typeof name !== 'undefined') user.name = name;
            if (typeof email !== 'undefined') user.email = email;
            if (typeof password !== 'undefined') user.password = password;
            return user.save().then(() => {
                return res.json({user: user.getModelUser(), message: 'Cadastro Atualizado'});
            }).catch(next);
        }).catch(next);
    };

    async removeUserAccount(req, res, next) {
        const id = req.payload._id;
        await userModel.findByIdAndRemove(id).then(user => {
            if(!user) return res.status(404).json({error: "Usuário não cadastrado"})
            res.json({message: 'Sua conta foi excluida!'});
        }).catch(next);
    };

    showRecovery(req, res, next) {
        return res.render('../views/recovery.ejs', {error: null, success: null});
    };

    async createRecovery(req, res, next) {
        const { email } = req.body;
        if(!email) return res.render('recovery', { error: "Preencha com o seu email", success: null });
        await userModel.findOne({ email }).select('+password').then((user) => {
            if(!user) return res.render(recovery_view, {error: "Usuário não cadastrado", success: null})
            const recoveryData = user.recoveryPassword();
            return user.save().then(() => {
                sendEmailRecovery({user, recovery: recoveryData}, (error = null, success = null) => {
                    return res.render(recovery_view, {error, success});
                });
            }).catch(next)
        }).catch(next)
    };

    async showFinishRecovery(req, res, next) {
        if(!req.query.token) return res.render("recovery", { error: "Token não identificado", success: null });
        await userModel.findOne({"recovery.token": req.query.token}).then((user) => {
            if(!user) return res.render(recovery_view, {error: "Não existe usuário com esse token", success: null});
            if(new Date(user.recovery.date) < new Date()) return res.render(recovery_view, {error: "Token expirado", success: null});
            return res.render(recovery_store_view, {error: null, success: null, token: req.query.token});
        }).catch(next);
    };

    async finishRecovery(req, res, next) {
        const { token, password } = req.body;
        if(!token || !password) return res.render(recovery_store_view, {   error: "Preencha novamente com sua nova senha",
                                                                        success: null, token: token });
        await userModel.findOne({ "recovery.token": token }).select('+password').then(async (user) => {
            if(!user) return res.render(recovery_view, {error: "Usuário não identificado", success: null});
            user.resetToken();
            user.password = password;
            return user.save().then(() => {
                return res.render(recovery_store_view, {   error: null,
                                                        success: "Senha alterada com Sucesso",
                                                        token: null });
            }).catch(next);
        }).catch(next);
    }

    async index(req, res, next) {
        try {
            await userModel.findById(req.payload._id).then(user => {
                if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
                return res.json({user: user.getModelUser()});
            }).catch(next);
        }catch (next) {
            return null;
        }
    };

    async getUserById(req, res, next) {
        await userModel.findById(req.params.id).then(user => {
            if(!user) return res.status(401).json({error: "Usuário não cadastrado!"});
            return res.json({ user: user.getModelUser()});
        }).catch(next);
    };

}

module.exports = UserController;