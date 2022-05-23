const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

    hospitalId:{
        type: String,
        required: true,
        default: "H001"
    },

    patientId: {
        type: String,
        required: true,
    },

    name: {
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
    encryptedPatientSystemKey: {
        type: String,
        required: true
    },
    doctorList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Doctor'
    }],
    
    
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;