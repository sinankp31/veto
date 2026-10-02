import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    description: {
        type: String,
        required: true,
        minLength: 20,
        maxLength: 500
    },
    images: {
        type: [{
            type: String
        }],
        validate: {
            validator: images => images.length <= 5,
            message : "Product can have atmost 5 images"
        }
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["INR", "USD"],
            default: "INR"
        }
    },
    sizes: [{
        size:  {
            type: String,
            enum: ["XS", "S", "M", "L", "XL", "XXL"],
            required: true
        },
        stock: {
            type: Number,
            min: 0,
            default: 0
        }
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})

const productModel = mongoose.model("products",productSchema)

export default productModel