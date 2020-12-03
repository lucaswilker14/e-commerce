import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'


const storeSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    CNPJ: {
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

storeSchema.plugin(uniqueValidator, {message: 'is already being used'});

module.exports = model('Store', storeSchema);