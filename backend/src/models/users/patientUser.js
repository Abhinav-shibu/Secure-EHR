const mongoose = require('mongoose');

const patientUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password : {
        type: String,
        required: [true, 'Password cannot be blank']
    }
})

module.exports = mongoose.model('patientUser', patientUserSchema);