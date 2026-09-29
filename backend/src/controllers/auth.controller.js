import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import {createAccessToken, createRefreshToken} from '../utils/auth.util.js'

/**
 * @description Create a user by saving the data from req.body into database
 * @param req Express.Request
 * @param req.body Object
 * @param req.body.name String
 * @param req.body.email String
 * @param req.body.password String
 */
export const register = async (req,res) =>{

    const {name,email,password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            success:false,
            message:"User already exist with this email address",
            errors:[
                {
                    field:'email',
                    message:"User already exist with this email address",
                }
            ]
        })
    }

    const user = await userModel.create({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12)
    })

    const accessToken = await createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = await createRefreshToken({
        userId: user._id,
        role: user.role
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly: true
    })

    await userModel.findByIdAndUpdate(user._id,{
        refreshToken
    })

    res.status(201).json({
        success: true,
        message: "User registered succesfully",
        data: {
            user: {
                name: user.name,
                email: user.email,
                userId: user._id
            },accessToken
        }
    })
}

/**
 * @description Login a user by authentication and update the access token and refresh token
 * @param req Express.Request
 * @param req.body Object
 * @param req.body.email String
 * @param req.body.password String
 */
export const login = async (req,res) =>{

    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if(!isPasswordValid){
        return res.status(400).json({
            success:false,
            message:"Invalid email or password"
        })
    }

    const accessToken = await createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = await createRefreshToken({
        userId: user._id,
        role: user.role
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly: true
    })

    await userModel.findByIdAndUpdate(user._id,{
        refreshToken
    })

    res.status(201).json({
        success: true,
        message: "User logged in succesfully",
        data: {
            user: {
                name: user.name,
                email: user.email,
                userId: user._id
            },accessToken
        }
    })

}
