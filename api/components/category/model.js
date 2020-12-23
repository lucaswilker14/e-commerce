import { Schema, model } from 'mongoose';

const categorySchema = new Schema ({

    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    products: {
        type: [{type: Schema.Types.ObjectID, ref: 'Product'}]
    },
    store: {
        type: Schema.Types.ObjectID,
        ref: 'Store'
    }
});

module.exports = model('Category', categorySchema);