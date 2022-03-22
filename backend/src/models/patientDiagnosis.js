const mongoose = require("mongoose");

const patientDiagnosisSchema = new mongoose.Schema({

    hospitalId:{
        type: String,
        required: true,
        default: "H001"
    },

    patientId:{
        type: String,
        required: true
    },

    doctorId: {
        type: String,
        required: true
    },

    consultationDate: {
        type: Date,
        required: true
    },

    symptoms: {
        type: String,
        required: true
    },
    
    diagnosticResults: {
        type: String,
        required: false 
    }
});

const PatientDiagnosis = mongoose.model("PatientDiagnosis", patientDiagnosisSchema);
module.exports = PatientDiagnosis;