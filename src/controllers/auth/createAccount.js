import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

// utils and config 
import { cloudinaryUploader } from '../../utils/cloudinaryUploader.js'

// models 
import User from '../../models/user.model.js'
import Session from '../../models/session.model.js'

// 
dotenv.config()


// fields for upload on sign-up route
export const requestedFields = [
    { name: "avatar", maxCount: 1 },
]

export const createAccount = asyncHandler(async (req, res) => {

    // check if this email connected with an active account or not
    const user = await User.findOne({ email: req.body.email }).sort({ createdAt: -1 })
    
    // if there is an account connected with this email
    if (user && ["Active", "Inactive"].includes(user.status)) {
        return res.status(400).json({ 
            status: "fail",
            message:{
                english: "This email is already connected with an account",
                arabic: "هذا البريد الإلكتروني مرتبط بحساب بالفعل"
            }
        })
    }

    // check if phone number is already connected with another account
    const userPhone = await User.findOne({ phone: req.body.phone }).sort({ createdAt: -1 })
    if (userPhone && ["Active", "Inactive"].includes(userPhone.status)) {
        return res.status(400).json({
            status: "fail",
            message: {
                english: "This phone number is already connected with another account",
                arabic: "هذا الرقم مرتبط بحساب آخر بالفعل"
            }
        })
    }

    // check required files
    const avatar = req.files?.avatar ? req.files.avatar[0] : null

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    // upload avatar image
    const uploadedAvatar = avatar ? await cloudinaryUploader(avatar.buffer, "avatars") : null
    
    // create account
    const newAccount = await User.create({
       name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       password: hashedPassword,
       role: req.body.role,
       gender: req.body.gender,
       avatar: uploadedAvatar ? {url: uploadedAvatar.url, id: uploadedAvatar.public_id} : null,
    })


    // create token for verify email
    const token = jwt.sign(
        { _id: newAccount._id, email: newAccount.email, role: newAccount.role },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    )

    // cookie for verify email
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("Medical_Center_Auth", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
        maxAge: 10 * 60 * 1000, // 10 minutes
    });

    // create session
    await Session.create({ 
        userId: newAccount._id, // reference
        token, // token
        ip: req.ip, // ip address
        agent: req.get("user-agent"), // user agent
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    })

    // response
    res.status(201).json({
        status: "success",
        message:{
            english: "Account created successfully",
            arabic: "تم إنشاء الحساب بنجاح"
        }
    })
})