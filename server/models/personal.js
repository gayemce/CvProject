const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonalSchema = new Schema({
    _id: String,
    profileImg: String,
    name: String,
    surname: String,
    profession: String,
    address: String,
    email: String,
    phone: String,
    myProfile: String
})

//collection oluşturur.
const Personal = mongoose.model("Personal", PersonalSchema);
module.exports = Personal;