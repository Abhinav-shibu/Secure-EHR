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
        type: Number,
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
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Patient'
    }]
    
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;