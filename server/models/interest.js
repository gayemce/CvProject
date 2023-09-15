const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interestSchema = new Schema({
    _id: String,
    icon: String,
    name: String
})

const Interest = mongoose.model("Interest", interestSchema);
module.exports = Interest;