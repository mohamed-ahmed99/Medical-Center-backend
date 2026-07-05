import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'

// models
import Sessions from "../models/session.model.js"

dotenv.config()

export const verifyToken = (cookieName, ...allowedRoles) => asyncHandler(async(req, res, next) => {
    // get token
    const token = req.cookies[cookieName]
    if(!token) {
        return res.status(401).json({
            status: "fail",
            message: {
                english: "No token provided",
                arabic: "جلسة غير صالحة"
            }
        })
    }

    // verify token
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            status: "fail",
            message: {
                english: "Invalid or expired token",
                arabic: "رمز غير صالح أو منتهي الصلاحية"
            }
        })
    }

    // check if user has allowed role
    if(allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
            status: "fail",
            message: {
                english: "You don't have permission to access this resource",
                arabic: "ليس لديك صلاحية للوصول إلى هذا المورد"
            }
        })
    }

    // check if token exist in DB
    const userSession = await Sessions.findOne({token: token})

    // check if token is valid
    if(!userSession) {
        return res.status(401).json({
            status: "fail",
            message: {
                english: "Invalid session",
                arabic: "جلسة غير صالحة"
            }
        })
    }

    // check if session is inactive or expired
    if(userSession.status === "Inactive" || userSession.expiresAt < Date.now()) {
        return res.status(401).json({
            status: "fail",
            message: {
                english: "Session expired",
                arabic: "انتهت صلاحية الجلسة"
            }
        })
    }


    // attach user to request
    req.user = decodedToken
    next()
})