import Joi from 'joi';

const required_only     = Joi.string().required();
const required_email    = Joi.string().email().required();
const required_id       = Joi.string().id().length(24).required();
const required_optional = Joi.string().optional();

const getByIdValidator = Joi.object({
    id: required_id
});

const registerUserValidator = Joi.object({
      name: required_only
    , email: required_email
    , password: required_only
    , store: required_id
});

const loginValidator = Joi.object({
      email: required_email
    , password: required_only
});

const updateUserValidator = Joi.object({
      name: required_optional
    , email: Joi.string().email().optional()
    , password: required_optional
});


module.exports = {  getByIdValidator
                    , registerUserValidator
                    , loginValidator
                    , updateUserValidator };
