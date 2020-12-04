import Joi from 'joi';
import { model } from 'mongoose';


const required_only  = Joi.string().required();
const required_email = Joi.string().email().required();
const required_optional  = Joi.string().optional();
const required_id       = Joi.string().id().length(24).required();
const userModel = model('User');


const isAdmin = (req, res, next) => {
    if (!req.payload._id) return res.sendStatus('401');
    const { loja } = req.query;
    if (!loja) return res.sendStatus('401');
    userModel.findById(req.payload._id)
        .then(user => {
            if (!user) return res.sendStatus('401');
            if (!user.store) return res.sendStatus('401');
            if (!user.role.includes('admin')) return res.sendStatus('401');
            if (user.store.toString() !== loja) return res.sendStatus('401');
            next();
        })
        .catch(next);
}

const getStoreById = Joi.object({
   id:  required_id
});

const registerStore = Joi.object({
        name:     required_only
    ,   CNPJ:     Joi.string().length(18).required()
    ,   email:    required_email
    ,   phones:   Joi.array().items(required_only).required()
    ,   address:  Joi.object({
            street:         required_only
        ,   number:         required_only
        ,   complement:     required_only
        ,   neighborhood:   required_only
        ,   city:           required_only
        ,   CEP:            required_only
    }).required()
});

const update = Joi.object({
        name:     required_optional
    ,   CNPJ:     Joi.string().length(18).optional()
    ,   email:    required_optional.email()
    ,   phones:   Joi.array().items(required_only).optional()
    ,   address:  Joi.object({
        street: required_only
        , number: required_only
        , complement: required_only
        , neighborhood: required_only
        , city: required_only
        , CEP: required_only
    }).optional()
});


module.exports = { isAdmin, getStoreById, registerStore, update };