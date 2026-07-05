import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    // personal info
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true, select:false},
    phone:{type:String, required:true},

    status: {
        type: String,
        enum: ["Active", "Blocked", "Deleted"],
        default: "Active"
    },

    // roles
    role:{
        type:String,
        enum: ["Admin", "Doctor", "Secretary"],
        default: "Secretary"
    },

    gender: { type: String, enum: ["Male", "Female"], required: true },
}, {timestamps:true})

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.index({email:1,createdAt:-1})

const User = mongoose.model('User', userSchema)
export default User