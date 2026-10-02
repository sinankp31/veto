import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import config from '../configs/env.config.js'
import {createAccessToken, createRefreshToken, verifyRefreshToken} from '../utils/auth.util.js'

const refreshCookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth'
}

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

    res.cookie("refreshToken",refreshToken,refreshCookieOptions)

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

    let isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid && password !== password.trim()) {
        isPasswordValid = await bcrypt.compare(password.trim(), user.passwordHash)
    }

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

    res.cookie("refreshToken",refreshToken,refreshCookieOptions)

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

/**
 * @description Refresh the current refresh token and access token into a new set of refresh token and access token
 */
export const refresh = async (req, res) =>{

    const refreshToken = req.cookies?.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"Refresh token required"
        })
    }

    let decoded
    try {
        decoded = await verifyRefreshToken(refreshToken)
    } catch {
        return res.status(401).json({
            success:false,
            message:"Invalid refresh token"
        })
    }

    const user = await userModel.findById(decoded.userId)

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
        })
    }

    if (refreshToken !== user.refreshToken) {
        await userModel.findByIdAndUpdate(user._id, {refreshToken: null})
        return res.status(401).json({
            success: false,
            message: "Refresh token mismatch"
        })
    }

    const accessToken = await createAccessToken({
        userId: user._id,
        role: user.role
    })

    const newRefreshToken = await createRefreshToken({
        userId: user._id,
        role: user.role
    })

    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: newRefreshToken
    })
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions)

    return res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        data: {
            user: {
                name: user.name,
                email: user.email,
                userId: user._id
            },
            accessToken
        }
    })
}

/**
 * @description Get the details of user who requested
 */
export const getMe = async (req,res) =>{

    const {userId, role } = req.user

    const user = await userModel.findById(userId)

    if(!user){

        return res.status(400).json({
            success:false,
            message:"User not exists"
        })
    }

    return res.status(200).json({
        success:true,
        message:"User data fetched succesfully",
        data: {
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        }
    })
}
