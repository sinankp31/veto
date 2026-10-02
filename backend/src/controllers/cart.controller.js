import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export const addToCart = async (req, res) =>{

    const {productId, quantity, size} = req.body

    const product = await productModel.findById(productId)

    if (!product) {
        return res.status(404).json({ 
            success: false,
            message: "Product not found"
        });
    }

    const selectedSize = await product.sizes.find(s => s.size === size);

    if (!selectedSize) {
        return res.status(400).json({ 
            success: false,
            message: "Selected size is not available for this product"
        });
    }

    if (selectedSize.stock < quantity) {
        return res.status(400).json({ 
            success: false,
            message: "Insufficient stock for the selected size"
        });
    }

    let cart = await cartModel.findOne({user: req.user.userId})

    if(!cart){
        cart = await cartModel.create({
            user: req.user.userId,
            products: []
        })
    }

    const existingProduct = await cart.products.find((p => p.product.toString() === productId) && (p.size === size));

    if(existingProduct){

        if((existingProduct.quantity+quantity) > selectedSize.stock){
                return res.status(400).json({ 
                    success: false,
                    message: "Adding this quantity exceeds available stock for the selected size"
           });
        }

        await cartModel.updateOne(
            {
                user: req.user.userId,
                "products.product": productId,
                "products.size": size
            },
            {
                $inc: {
                    "products.$.quantity": quantity
                }
            }
        )

        return res.status(200).json({
            success: true,
            message: "Product quantity updated in cart successfully"
        })
    }

    await cartModel.updateOne(
        {
            user: req.user.userId
        },
        {
            $push: {
                products: {
                    product: productId,
                    quantity: quantity,
                    size: size
                }
            }
        }
    )

    return res.status(200).json({
        success: true,
        message: "Product added to cart successfully"
    })

}

export const getCart = async (req, res) =>{

    const cart = (await cartModel.findOne({user: req.user.userId})) 
            ?? (await cartModel.create({
                    user: req.user.userId,
                    products: []
               })
            )

    return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: cart
    })
}