import mongoose, { Mongoose, Schema, model } from "mongoose";

const cartsSchema = new Schema({
  
    products:{
        type: [
            {
                product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
                },
                quantity:{
                    type: Number,
                    required: true
                }
            },
        ],
        default: [],
    }
})

cartsSchema.pre('findOne', function () {
    this.populate('products._id')
})

export const cartModel = model('cart', cartsSchema)