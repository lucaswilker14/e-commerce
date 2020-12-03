import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { secret } from '../../config/config'

const userSchema = new Schema ({

    name: {
        type: String,
        required: [true, "is required"]
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "is required"],
        index: true,
        match: [/\S+@\S+\.\S+/, 'email is invalid']
    },

    store: {
        type: Schema.Types.ObjectID,
        ref: 'store',
        required: [true, 'is required']
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

userSchema.plugin(uniqueValidator, {message: 'is already being used'});

userSchema.methods.encryptPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString();
};

userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString();
    return hash === this.hash;
}

userSchema.methods.generateUserToken = function() {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 15);

    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        exp: parseFloat(exp.getTime() / 1000, 10)
    }, secret);
};

userSchema.methods.getUserDecrypt = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        store: this.store,
        role: this.role,
        token: this.generateUserToken()
    }
};

userSchema.methods.recoveryPassword = function() {
    this.recovery = {};
    this.recovery.token = crypto.randomBytes(16).toString('hex');
    this.recovery.date = new Date(new Date().getTime() + 24*60*60*1000);
    return this.recovery;
};

userSchema.methods.resetToken = function() {
    this.recovery = {token: null, date: null};
    return this.recovery;
};

module.exports = model('User', userSchema);