import Day from "../../models/day.model.js"
import asyncHandler from "express-async-handler"



export const newDay = asyncHandler(async (req, res) => {
    const { date } = req.body

    // check if the date is valid using Date() object
    if(!date || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
       return res.status(400).json({
            status: "fail",
            message: {
                english: "Please provide a valid date in the format year-month-day e.g. 2024-01-01",
                arabic: "الرجاء إدخال تاريخ صالح بالصيغة سنة-شهر-يوم مثال 2024-01-01"
            }
        })
    }

    // check if day already exists
    const dayExists = await Day.findOne({ date })
    if(dayExists) {
       return res.status(400).json({
            status: "fail",
            message: {
                english: "Day already exists",
                arabic: "هذا اليوم موجود بالفعل"
            }
        })
    }

    const lastDay = await Day.findOne({status: 'Active' })
    .sort({ createAt: -1 })
    .limit(1)

    if(lastDay) {
        lastDay.status = 'Closed'
        await lastDay.save()
    }



    const day = await Day.create({ date, createdBy: req.user._id })
    return res.status(201).json({ success: true, message: "Day created successfully", day })
})
