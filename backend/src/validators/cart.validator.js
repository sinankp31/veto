import {body, validationResult} from 'express-validator';

export const addToCartValidator = [
    body('productId')
        .notEmpty().withMessage("Product ID is required").bail()
        .isString().withMessage("Product ID must be a string").bail()
        .isMongoId().withMessage("Product ID must be a valid MongoDB ObjectId"),
    body('quantity')
        .notEmpty().withMessage("Quantity is required").bail()
        .isInt({min: 1}).withMessage("Quantity must be a positive integer").bail()
        .toInt(),
    body('size')
        .notEmpty().withMessage("Size is required").bail()
        .isString().withMessage("Size must be a string").bail()
        .isIn(["XS", "S", "M", "L", "XL", "XXL"]).withMessage("Invalid size"),
    (req, res, next) =>{

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: "Validation failed",
                errors: errors.array() });
        }
        
        next();
    }
]