import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
const protect = asyncHandler(async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer'){
        try{
            token=req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            // console.log(decoded)
            req.user=await User.findById(decoded.id).select('-password')
            next()
        } catch(error){
            console.log("error: ",error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not Authorized,no Token')
    } 
})


const admin = asyncHandler(async (req, res, next) => {
    // console.log("req.user: ", req.user)
    if(req.user && req.user.isAdmin){
        // console.log("calling next")
        next()
    }
    else {
        res.status(401)
        throw new Error('Not authorised as Admin')
    }
})

export { protect,admin }