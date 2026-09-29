import jwt from 'jsonwebtoken'
import config from '../configs/env.config.js'

export const createAccessToken = async ({userId, role})=>{
    
    const accessToken = await jwt.sign({
        userId,
        role
    },config.ACCESS_TOKEN_SECRET, {expiresIn : "15m"})

    return accessToken
}

export const createRefreshToken = async ({userId, role})=>{
    
    const refreshToken = await jwt.sign({
        userId,
        role
    },config.REFRESH_TOKEN_SECRET, {expiresIn : "7d"})

    return refreshToken
}

export const verifyRefreshToken = async (refreshToken)=>{

    return await jwt.verify(refreshToken,config.REFRESH_TOKEN_SECRET)
}

export const verifyAccessToken = async (accessToken)=>{

    return await jwt.verify(accessToken,config.ACCESS_TOKEN_SECRET)
}