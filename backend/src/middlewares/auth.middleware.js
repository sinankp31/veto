import {verifyAccessToken} from '../utils/auth.util.js'

export const authenticate = async(req, res, next) =>{

    const accessToken = req.headers.authorization?.split(" ")[1]

    if(!accessToken){
        return res.status(401).json({
            success:false,
            message:"Access token not found in the header"
        })
    }

    try{

        const decoded = await verifyAccessToken(accessToken)

        req.user = decoded

        next()
    }catch(err){

        return res.status(401).json({
            success:false,
            message:"Invalid or expired access token",
            error:err
        })
    }
} 