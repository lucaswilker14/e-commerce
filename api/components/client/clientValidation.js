import Joi from 'joi';

const required_only     = Joi.string().required();
const required_id       = Joi.string().id().length(24).required();
const required_optional = Joi.string().optional();
const required_number   = Joi.number();


// admin
const index = Joi.object({
    offset: required_number,
    limit:  required_number
});

const searchOrders = Joi.object({

});

const searchClient = {
    query:  Joi.object({
        offset: required_number,
        limit:  required_number
    }),
    params: Joi.object({
        search: required_only
    })
};

const getAdmin = Joi.object({
    id: required_id
});

const getAllOrderClients = Joi.object({

});

const updateAdmin = {
    params: Joi.object({
        id: required_id
    }),
    body: Joi.object({
        name: required_optional
        , CPF: required_optional
        , email: required_optional.email()
        , phones: Joi.array().items(required_only).optional()
        , address: Joi.object({
            street: required_only
            , number: required_only
            , complement: required_only
            , neighborhood: required_only
            , city: required_only
            , CEP: required_only
        }).optional()
        , dateOfBirth: Joi.date().format("YYYY-MM-DD").raw().optional()
    })
};


// client
const getClient = Joi.object({
    store:  required_id
});

const createInStore = {
    query: Joi.object({
        store: required_id
    }),
    body: Joi.object({
        name: required_only
        , email: required_email
        , CPF: required_only
        , phones: Joi.array().items(required_only).optional()
        , address: Joi.object({
            street: required_only
            , number: required_only
            , complement: required_only
            , neighborhood: required_only
            , city: required_only
            , CEP: required_only
        }).optional()
        , dateOfBirth: Joi.date().format("YYYY-MM-DD").raw().optional()
        , password: required_only
    })
};

const updateClient = {
    query: Joi.object({ store: required_id }),
    params: Joi.object({ id: required_id }),
    body: Joi.object({
        id: required_id
        , store: required_id
        , name: required_optional
        , CPF: required_optional
        , email: required_optional.email()
        , phones: Joi.array().items(required_only).optional()
        , address: Joi.object({
            street: required_only
            , number: required_only
            , complement: required_only
            , neighborhood: required_only
            , city: required_only
            , CEP: required_only
        }).optional()
        , dateOfBirth: Joi.date().format("YYYY-MM-DD").raw().optional()
        , password: required_optional
    })
};


module.exports = {
    index
    , searchOrders
    , searchClient
    , getAdmin
    , getAllOrderClients
    , updateAdmin
    , getClient
    , createInStore
    , updateClient
}