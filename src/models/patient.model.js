import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({

    // The name of the patient
    patientName: { type: String, required: true },

    // The phone number of the patient
    phone: { type: String, required: true },  

    // The doctor who will see the patient
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  

    // The day the patient was registered on
    day: { type: mongoose.Schema.Types.ObjectId, ref: "Day" }, 

    // The number of the patient in the queue
    queueNumber: { type: Number, required: true }, 

    // The status of the patient
    status: { 
        type: String, 
        enum: ["waiting", "in_progress", "finished"], 
        default: "waiting" 
    }

}, { timestamps: true })

const Patient = mongoose.model("Patient", patientSchema)

export default Patient