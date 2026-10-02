import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            size: {
                type: String,
                enum: ["XS", "S", "M", "L", "XL", "XXL"],
                required: true
            }
        }
    ]
})

const cartModel = mongoose.model("carts", cartSchema)

export default cartModel