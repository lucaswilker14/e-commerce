import Joi from "joi";

const required_only     = Joi.string().required();
const required_id       = Joi.string().id().length(24).required();
const optional_id       = Joi.string().id().length(24).optional();
const optional          = Joi.string().optional();

const index = Joi.object({
    loja: required_id
});

const getAvailable = Joi.object({
    loja: required_id
});

const getAvailableByID = {
    query: Joi.object({
       loja: required_id
    }),
    params: Joi.object({
      id: required_id
    })
};

const createCategory = Joi.object({
    name: required_only,
    code: required_only
})

const update = {
    body: Joi.object({
        name:           optional
        , code:         optional
        , available:    Joi.boolean().optional()
        , products:     Joi.array().items(optional_id)
    }),
    params: Joi.object({
        id: required_id
    })
};

const remove = Joi.object({
    id: required_id
})


module.exports = {
    index
    , getAvailable
    , getAvailableByID
    , createCategory
    , update
    , remove
}