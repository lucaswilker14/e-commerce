import { Schema, model } from 'mongoose';
import { paginate } from 'mongoose-paginate';

const clientSchema = new Schema({

    user: {
        type: Schema.Types.ObjectID,
        ref: 'user',
        required: [true, 'is required']
    },

    name: {
        type: String,
        required: [true, 'is required']
    },

    dateOfBirth: {
        type: Date,
        required: [true, 'is required']
    },

    CPF: {
        type: String,
        required: [true, 'is required']
    },

    phones: {
        type: [{ type: String }]
    },

    deleted: {
        type: Boolean,
        default: false
    },

    store: {
        type: Schema.Types.ObjectID,
        required: [true, 'is required']
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
            state: {
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

clientSchema.plugin(paginate);

module.exports = model('Client', clientSchema);