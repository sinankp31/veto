import productModel from "../models/product.model.js";
import {uploadImage} from "../services/storage.service.js";

export const createProduct = async (req, res) => {

    const imageUrls = []

    for(let i=0; i<req.files.length; i++){
        const response = await uploadImage({
            buffer: req.files[i].buffer,
            originalname: req.files[i].originalname
        })

        imageUrls.push(response.url);

    }

    const product = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        images: imageUrls,
        price: req.body.price,
        sizes: req.body.sizes,
        seller: req.user.userId
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    })

}

export const listAllProducts = async (req, res) => {

    const products = await productModel.find()

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products
    })

}
