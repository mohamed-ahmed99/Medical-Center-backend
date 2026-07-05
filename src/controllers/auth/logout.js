import asyncHandler from "express-async-handler"
import Session from "../../models/session.model.js"

export const logout = asyncHandler(async (req, res) => {
    // get token from cookies
    const userId = req.user._id
    const token = req.cookies["Medical_Center_Auth"]
    const target = req.query.target || "me"

    let resMSG = ""

    // logout from current session
    if(target == "me") {
        if (token) {
            // find session and mark it as revoked
            await Session.findOneAndUpdate(
                { token },
                { 
                    status: "Inactive", 
                    revokedReason: "user logged out" 
                }
            )
            resMSG = {
                english: "Logged out successfully",
                arabic: "تم تسجيل الخروج بنجاح"
            }
        }
    } 
    // logout from all sessions
    else if(target == "all") {
        await Session.updateMany(
            { account: userId, status: "Active" },
            { 
                status: "Inactive", 
                revokedReason: "user logged out from all sessions" 
            }
        )
        resMSG = {
            english: "Logged out from all sessions successfully",
            arabic: "تم تسجيل الخروج من جميع الجلسات بنجاح"
        }
    }
    // logout from all sessions except current (others)
    else if(target == "others") {
        await Session.updateMany(
            { userId: userId, token: { $ne: token }, status: "Active" },
            { 
                status: "Inactive", 
                revokedReason: "user logged out from other sessions" 
            }
        )
        resMSG = {
            english: "Logged out from all other sessions successfully",
            arabic: "تم تسجيل الخروج من جميع الجلسات الأخرى بنجاح"
        }
    }
    else {
       return res.status(400).json({
            status: "fail",
            message: {
                english: "Invalid target",
                arabic: "الهدف غير صحيح"
            }
        })
    }

    // clear the authentication cookie
    res.clearCookie("Medical_Center_Auth", {path: "/"})

    res.status(200).json({
        status: "success",
        message: resMSG
    })
})