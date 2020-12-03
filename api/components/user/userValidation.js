import Joi from 'joi';

const required_only  = Joi.string().required();
const required_email = Joi.string().email().required();
const required_token = Joi.string().token().required();
const required_id    = Joi.string().id().required();

const getByIdValidator = Joi.object({
    _id: required_id
});

const registerUserValidator = Joi.object({
    name: required_only,
    email: required_email,
    password: required_only,
    store: required_only
});

const loginValidator = Joi.object({
    email: required_email,
    password: required_only
});

const updateUserValidator = Joi.object({
    name: required_only,
    email: required_email,
    password: required_only
});

const removeUserValidator = Joi.object({
    _id: required_id
});

const createRevoveryValidator = Joi.object({
    email: required_email
});

const showFinishRecoveryValidator = Joi.object({
    token: required_token
});

const finishRecoveryValidator = Joi.object({
    token: required_token,
    password: required_only
});


module.exports = {  getByIdValidator
                    , registerUserValidator
                    , loginValidator
                    , updateUserValidator
                    , removeUserValidator
                    , createRevoveryValidator
                    , showFinishRecoveryValidator
                    , finishRecoveryValidator  };
