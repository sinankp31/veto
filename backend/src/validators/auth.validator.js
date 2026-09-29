import {body, validationResult} from 'express-validator';

export const registerValidator = [
    body('name')
        .notEmpty().withMessage("Name is required").bail()
        .isString().withMessage("Name must be a string").bail()
        .trim()
        .isLength({min: 3,max:50}).withMessage("Name must be between 3 and 50 characters long"),
    body('email')
        .notEmpty().withMessage("Email is required").bail()
        .trim()
        .isEmail().withMessage("Email must be a valid email address"),
    body('password')
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage("Password must be a string").bail()
        .trim()
        .isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
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