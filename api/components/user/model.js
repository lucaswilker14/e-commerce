const mongoose =        require('mongoose');
const schema =          mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto =          require('crypto');
const jwt =             require('jsonwebtoken');
const secret =          require('/api/config/config').secret;

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

userSchema.plugin(uniqueValidator, {message: 'is already being used'});

userSchema.methods.encryptPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString();
};

userSchema.methods.validatePassword = (password) => {
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString();
    return password === this.hash;
}

userSchema.methods.generateToken = () => {
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

userSchema.methods.getToken = () => {
    return {
        name: this.name,
        email: this.email,
        store: this.store,
        role: this.role,
        token: this.generateToken()
    }
}

userSchema.recoveryPassword = () => {
    this.recovery = {};
    this.recovery.token = crypto.randomBytes(16).toString('hex');
    this.recovery.date = new Date(new Date().getTime() + 24*60*60*1000);
    return this.recovery;
};

userSchema.methods.finishToken = () => {
    this.recovery = {token: null, date: null};
    return this.recovery;
};

module.exports = mongoose.model('User', userSchema);