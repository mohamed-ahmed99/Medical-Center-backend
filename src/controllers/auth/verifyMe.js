import asyncHandler from 'express-async-handler'
import User from '../../models/user.model.js'


// verify-me 
export const verifyMe = asyncHandler(async (req, res) => {
    // check if user in dataBase or not
    if (!req.user?._id) {
        return res.status(401).json({ 
            status: "fail", 
            message: {
                english: "User not found",
                arabic: "المستخدم غير موجود"
            }, 
            data: null 
        });
    }

    // get user from dataBase
    const user = await User.findById(req.user._id)

    // check if user not found
    if (!user) {
        return res.status(404).json({ 
            status: "fail", 
            message: { 
                english: "User not found",
                arabic: "المستخدم غير موجود"
            }, 
            data: null 
        });
    }

    // check if user is active or unverified
    const userStatus = user.status
    if (userStatus !== "Active") {
        return res.status(401).json({ 
            status: "fail", 
            message: {
                english: "This account is inactive or deleted, please contact the admin",
                arabic: "هذا الحساب غير نشط أو محذوف، يرجى التواصل مع الادمن"
            }, 
            data: null 
        });
    }

    // response
    const userData = {
        _id: user._id,
        role: user.role,
        status: user.status,
        email: user.email,
        name: user.name,
        avatar: user?.avatar?.url || null,
    };

    return res.status(200).json({
        status: "success",
        message: "User verified successfully",
        data: {
            user: userData
        }
    })
})
