const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    _id: String,
    name: String
})

const Language = mongoose.model("Language", languageSchema);
module.exports = Language;