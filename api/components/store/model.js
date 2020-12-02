const mongoose          = require('mongoose');
const schema            = mongoose.Schema;
const uniqueValidator   = require('mongoose-unique-validator');

const storSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: [true, "is required!"],
        unique: true
    },
    email: String,
    phones: {
        type: [{type: String}]
    },
    address: {
        type: {
            street: {
                type: String,
                required: true
            },
            number: {
                type: String,
                required: true
            },
            complement: {
                type: String
            },
            neighborhood: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            CEP: {
                type: String,
                required: true
            }
        }, required: true
    }
});

storSchema.plugin(uniqueValidator, {message: 'is already being used'});

module.exports = mongoose.model(storSchema);