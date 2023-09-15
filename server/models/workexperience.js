const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workExperienceSchema = new Schema({
    _id: String,
    title: String,
    yearSubtitle: String,
    description: String
})

const WorkExperience = mongoose.model("WorkExperience", workExperienceSchema);
module.exports = WorkExperience;