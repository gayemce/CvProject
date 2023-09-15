const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referenceSchema = new Schema({
    _id: String,
    subtitle: String,
    title: String,
    phone: String,
    email: String
})

const Reference = mongoose.model("Reference", referenceSchema);
module.exports = Reference;