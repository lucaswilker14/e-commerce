import { Schema, model } from 'mongoose';
import paginate  from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';


const clientSchema = new Schema({

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
        type: [{ type: String }],
        required: [true, 'is required']
    },

    deleted: {
        type: Boolean,
        default: false
    },

    address: {
        type: {
            street: {
                type: String,
                required: [true, 'is required']
            },
            number: {
                type: String,
                required: [true, 'is required']
            },
            complement: {
                type: String
            },
            neighborhood: {
                type: String,
                required: [true, 'is required']
            },
            city: {
                type: String,
                required: [true, 'is required']
            },
            state: {
                type: String,
                required: [true, 'is required']
            },
            CEP: {
                type: String,
                required: [true, 'is required']
            }
        },
        required: [true, 'is required']

    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'is required']
    },

    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, 'is required']
    }

});

clientSchema.plugin(uniqueValidator, {message: 'is already being used'});
clientSchema.plugin(paginate);


module.exports = model('Client', clientSchema);