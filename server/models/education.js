const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const educationSchema = new Schema({
    _id: String,
    title: String,
    studies: String,
    year: String
})

const Education = mongoose.model("Education", educationSchema);
module.exports = Education;