const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({

    hospitalId:{
        type: String,
        required: true,
        default: "H001"
    },

    doctorId: {
        type: String,
        required:  true
    },

    name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    age: {
        type: String,
        required: true
    },

    sex: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true 
    },

    phoneNumber: {
        type: String,
        required: true
    },

    patientList: [{
        patientId: {
            type: String,
            required: true
        },
        encryptedPatientSystemKey: {
            type: String,
            required: true
        }
    }]
    
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;