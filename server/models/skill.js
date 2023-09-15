const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    _id: String, //* guid id için npm i uuid
    title: String
})

const Skill = mongoose.model("Skill",skillSchema);
module.exports = Skill;