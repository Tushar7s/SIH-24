const { name } = require('ejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const patientSchema = new Schema({
    id:Number,
    age:Number,
    gender:String,
    date: date,
    opd:String,
    bed: String,
    emergency:String,
    discharge:String,
    amount:Number, 
});

const hospitalSchema = new Schema({
    patient:[patientSchema],
    admin:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
    }
});

const hospital =  mongoose.model("hospital", hospitalSchema);
module.exports = hospital;