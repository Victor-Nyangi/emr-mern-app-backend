const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
name : {
    type: String,
    required: true
},
description : {
    type: String,
    required: true
},
charge : {
    type: Number,
    requried: true
},
main_purpose : {
    type: String,
    required: true
},
updated_date: {
    type: Date,
    default: Date.now
  }
});
 
 
module.exports = Service = mongoose.model("Service", serviceSchema);
