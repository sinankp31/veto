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

export const listAllProductsToSeller = async (req, res) => {
    const products = await productModel.find({})

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products
    })
}

export const unlistProduct = async (req, res) => {

    const {id} = req.params;

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    await productModel.findByIdAndUpdate(id, 
        {
            published: false
        }
    );

    return res.status(200).json({
        success: true,
        message: "Product unlisted successfully"
    })
}

export const listProduct = async (req, res) => {

    const {id} = req.params;

    const product = await productModel.findById(id);

    if(!product){
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    await productModel.findByIdAndUpdate(id,
        {
            published: true
        }
    );  

    return res.status(200).json({
        success: true,
        message: "Product listed successfully"
    })
}