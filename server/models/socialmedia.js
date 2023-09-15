const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const socialMediaSchema = new Schema({
    _id: String,
    name: String,
    link: String,
    icon: String
})

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);
module.exports = SocialMedia;