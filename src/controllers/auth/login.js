import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from '../../models/user.model.js'
import Session from '../../models/session.model.js'
import dotenv from 'dotenv'

dotenv.config()

export const login = asyncHandler(async (req, res) => {
    const { email_or_phone, password } = req.body

    // 1. check if email and password are provided
    if (!email_or_phone || !password) {
        return res.status(400).json({ 
            status: "fail", 
            message: {
                english: "Please provide email or phone number",
                arabic: "يرجى تقديم البريد الإلكتروني أو رقم الهاتف"
            } 
        })
    }

    const isEmail = email_or_phone.includes("@")
    const query = isEmail
        ? { email: email_or_phone }
        : { phone: email_or_phone }

    // 2. find account by email
    const account = await User
        .findOne(query).sort({ createdAt: -1 }).select("+password")

    // 3. check if account exists
    if (!account) {
        return res.status(401).json({ 
            status: "fail", 
            message: {
                english: "This email or phone number doesn't belong to any account",
                arabic: "هذا البريد الإلكتروني أو رقم الهاتف لا ينتمي لأي حساب"
            } 
        })
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(password, account.password)

    // 4. check account status
    if (["Inactive", "Deleted"].includes(account.status)) {
        return res.status(403).json({ 
            status: "fail", 
            message: {
                english: "This account is inactive or deleted, please contact the admin",
                arabic: "هذا الحساب غير نشط أو تم حذفه، يرجى التواصل مع الادمن"
            } 
        })
    }


    // 5. compare password
    if (!isPasswordMatch) {
        return res.status(401).json({ 
            status: "fail", 
            message: {
                english: "Password is incorrect",
                arabic: "كلمة المرور غير صحيحة"
            } 
        })
    }

    // 6. generate JWT token
    const token = jwt.sign(
        { _id: account._id, role: account.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    )

    // 7. create session
    await Session.create({
        userId: account._id,
        token: token,
        ip: req.ip,
        agent: req.get("user-agent"),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })

    // 8. set cookie
    const isProduction = process.env.NODE_ENV === "production"
    res.cookie("Medical_Center_Auth", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    })

    // 9. return response
    res.status(200).json({
        status: "success",
        message: {
            english: "Logged in successfully",
            arabic: "تم تسجيل الدخول بنجاح"
        },
        data: {
            _id: account._id,
            email:  account.email,
            role: account.role,
        }
    })
})