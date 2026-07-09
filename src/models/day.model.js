import mongoose from "mongoose"

const daySchema = new mongoose.Schema({
    // The date of the day
    // Format: year-month-day (YYYY-MM-DD)  e.g. 2024-01-01
    date: { type: String, required: true }, 

    // The status of the day
    status: { 
        type: String, 
        enum: ["Active", "Closed"], 
        default: "Active" 
    },

    // The user who created the day
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }

}, { timestamps: true })

// index
daySchema.index({ date: 1, status: 1 })
daySchema.index({ date: 1, createdAt: -1 })
daySchema.index({ createdAt: -1 })

const Day = mongoose.model("Day", daySchema)

export default Day