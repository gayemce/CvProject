const mongoose = require("mongoose");
const uri = "mongodb+srv://test:1@testdb.ossuyq3.mongodb.net/";

function connect(){
    mongoose.connect(uri).then(res => {
        console.log("Connection is successful with Mongodb")
    });
}

module.exports = connect;