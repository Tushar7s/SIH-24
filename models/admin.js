const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")
const adminSchema = new Schema({
    id:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: true,
    },
});

adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin", adminSchema);