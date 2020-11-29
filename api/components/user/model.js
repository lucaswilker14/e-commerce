const mongoose = require('mongoose');
const schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('/api/config/config').secret;

const userSchema = new schema({

    name: {
        type: String,
        required: [true, "name is required"]
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "email is required"],
        index: true,
        match: [/\S+@\S+\.\S+/, 'email is invalid']
    },

    store: {
        type: schema.Types.ObjectID,
        ref: 'store',
        required: [true, 'store is required']
    },

    role: {
        type: Array,
        default: ['client']
    },

    recovery: {
        type: {
            token: String,
            date: Date
        },
        default: {}
    },

    hash: String,
    salt: String

});