const { name } = require('ejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const patientSchema = new Schema({
    name:String,
    age:Number,
    gender:String,
    date: Date,
});

const medicineSchema = new Schema({
    code:String,
    name:String,
    category:String,
    drugs:String,
    stock:Number,
    expiry:Date,
});

const hospitalSchema = new Schema({
    patient:[patientSchema],
    beds:Number,
    opd:Number,
    medicine:[medicineSchema],
    admin:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
    }
});

const hospital =  mongoose.model("hospital", hospitalSchema);
module.exports = hospital;