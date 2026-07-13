import Day from "../../models/day.model.js";
import asyncHandler from "express-async-handler";


export const getAllDays = asyncHandler(async (req, res) => {
    const days = await Day.find().sort({ createdAt: -1 })
    return res.status(200).json({
        status:'success', 
        message:{
            english:'Days fetched successfully',
            arabic:'تم جلب الأيام بنجاح'
        }, 
        data: {days}
    })
})