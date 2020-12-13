import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { genSaltSync, hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
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
        match: [/\S+@\S+\.\S+/, 'email is invalid'],
        select: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    store: {
        type: Schema.Types.ObjectId,
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
    }
});

userSchema.plugin(uniqueValidator, {message: 'is already being used'});

userSchema.pre('save', async function(next) {
    const salt = await genSaltSync(10);
    this.password = await hashSync(this.password, salt);
    next();
});


userSchema.methods.generateUserToken = function() {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    }, secret, {expiresIn: '1h'});
};


userSchema.methods.getModelUser = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        store: this.store,
        role: this.role
    }
};

userSchema.methods.recoveryPassword = function() {
    this.recovery = {};
    this.recovery.token = randomBytes(16).toString('hex');
    this.recovery.date = new Date(new Date().getTime() + 24*60*60*1000);
    return this.recovery;
};

userSchema.methods.resetToken = function() {
    this.recovery = {token: null, date: null};
    return this.recovery;
};

module.exports = model('User', userSchema);