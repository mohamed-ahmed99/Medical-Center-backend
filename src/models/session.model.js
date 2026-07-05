import mongoose from "mongoose";

// schema
const sessionSchema = new mongoose.Schema({
    
    // account
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // token
    token: { type: String, required: true },

    // ip address
    ip: { type: String },

    // status
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    
    // revoked reason
    revokedReason: { type: String },

    // expiresAt
    expiresAt: { 
        type: Date, 
        default:() => new Date( Date.now() + 24 * 60 * 60 * 1000)
    },
    
    // agent
    agent: { type: String },

}, { timestamps: true }
);

// indexes
sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ token: 1 });

const Session = mongoose.model("Session", sessionSchema)
export default Session