import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate';

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    promotion: {
        type: Number
    },
    sku: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectID,
        ref: "Category"
    },
    store: {
        type: Schema.Types.ObjectID,
        ref: "Store"
    },
    rating: {
        type: [{ type: Schema.Types.ObjectID, ref: 'Rating' }]
    },
    variations: {
        type: [{ type: Schema.Types.ObjectID, ref: 'Variations' }]
    },
}, { timestamp: true });

productSchema.plugin(paginate);

module.exports = model('Product', productSchema);