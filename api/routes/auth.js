const expressjwt = require('express-jwt');
const secret = require('../config/config').secret;

const getToken = (req) => {
    if(!req.header.authorization) return null;
    const token = req.header.authorization.split(' ')[1];
    if(token[0] !== "Bearer") return null;
    return token[1];
};
console.log(process.env.JWT_SECRET)

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