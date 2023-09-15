const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
    _id: String,
    title: String,
    description: String
})

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;