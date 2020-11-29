const jwt = require('express-jwt');
const secret = require('/api/config/config').secret;

const getToken = (req) => {
    if(!req.header.authorization) return null;
    const token = req.header.authorization.split(' ')[1];
    if(token[0] !== "Bearer") return null;
    return token[1];
};

const auth = {
    required: jwt({
        secret,
        userProperty: 'payload',
        getToken: getToken
    }),

    optional: jwt({
        secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getToken
    })
};

module.exports = auth;