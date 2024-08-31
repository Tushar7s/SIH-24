const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    age:Number,
    gender:String,
    mobile:Number,
    startTime: Date,
    endTime: Date,
    status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
