import {body, param, validationResult} from 'express-validator';

export const createProductValidator = [
    body("title")
        .notEmpty().withMessage("Title is required").bail()
        .isString().withMessage("Title must be a string").bail()
        .trim()
        .isLength({min: 2, max: 50}).withMessage("Title must be between 2 and 50 characters long"),
    body("description")
        .notEmpty().withMessage("Description is rquired").bail()
        .isString().withMessage("Desription must be a string").bail()
        .trim()
        .isLength({min: 20, max: 500}).withMessage("Description must be between 20 and 500 characters long"),
    body("price.amount")
        .notEmpty().withMessage("Price amount is required").bail()
        .isFloat({min: 0}).withMessage("Price amount must be a positive number"),
    body("price.currency")
        .notEmpty().withMessage("Price currency is required").bail()
        .isString().withMessage("Price currency must be a string").bail()
        .isIn(["INR", "USD"]).withMessage("Price currency must be either INR or USD"),
    body("sizes")
        .notEmpty().withMessage("Sizes are required").bail()
        .isArray().withMessage("Sizes must be an array"),
    body("sizes.*.size")
        .notEmpty().withMessage("Size is required").bail()
        .isString().withMessage("Size must be a string").bail()
        .trim()
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Size must be one of XS, S, M, L, XL, XXL"),
    body("sizes.*.stock")
        .notEmpty().withMessage("Stock is required").bail()
        .isInt({min: 0}).withMessage("Stock must be a positive integer"),
    (req, res, next) =>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"Invalid request",
                errors:errors.array()
            })
        }

        next();
    }

]

export const unlistProductValidator = [
    param("id")
        .notEmpty().withMessage("Product ID is required").bail()
        .isString().withMessage("Product ID must be a string").bail()
        .isMongoId().withMessage("Product ID must be a valid MongoDB ObjectId"),
    (req, res, next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"Invalid request",
                errors:errors.array()
            })
        }

        next();
    }
]

export const listProductValidator = [
    param("id")
        .notEmpty().withMessage("Product ID is required").bail()
        .isString().withMessage("Product ID must be a string").bail()
        .isMongoId().withMessage("Product ID must be a valid MongoDB ObjectId"),
    (req, res, next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"Invalid request",
                errors:errors.array()
            })
        }

        next();
    }
]