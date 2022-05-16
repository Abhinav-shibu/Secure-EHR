const mongoose = require('mongoose');

const systemKeySchema = new mongoose.Schema({

    hospitalId:{
        type: String,
        required: true,
        default: "H001"
    },    
    patientId: {
        type: String,
        required: [true, 'Cannot be blank']
    },
    systemKey : {
        type: String,
        required: [true, 'Cannot be blank']
    }
})


module.exports = mongoose.model('systemKey', systemKeySchema);