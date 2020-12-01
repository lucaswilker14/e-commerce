const expressjwt = require('express-jwt');
const secret = require('../config/config').secret;

const getToken = (req) => {
    if(!req.headers.authorization) return null;
    const token = req.headers.authorization.split(' ');
    if(token[0] !== "Bearer") return null;
    return token[1];
};

const auth = {
    required: expressjwt({
        secret: secret,
        algorithms: ['sha1', 'RS256', 'HS256'],
        userProperty: 'payload',
        getToken: getToken
    }),

    optional: expressjwt({
        secret: secret,
        algorithms: ['sha1', 'RS256', 'HS256'],
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getToken
    })
};

module.exports = auth;