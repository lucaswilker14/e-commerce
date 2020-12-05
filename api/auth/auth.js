import expressjwt from 'express-jwt';
import { secret } from '../config/config'

const getToken = (req, res, next) => {
    if(!req.headers.authorization) return null;
    const parts = req.headers.authorization.split(' ');
    const [ schema, token ] = parts;
    if (!/^Bearer$/i.test(schema)) return res.status(401).send({error: 'Token mal formado'});
    return token;

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