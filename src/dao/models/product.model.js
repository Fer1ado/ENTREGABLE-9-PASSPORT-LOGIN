

import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new Schema({
    status: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
    }
})

productSchema.plugin(mongoosePaginate) 

export const productModel = model('products', productSchema)