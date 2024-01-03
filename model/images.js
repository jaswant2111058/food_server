const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: String,
    event_id:String,
    user_id:String,
    type:Boolean,
    img:{
          data: Buffer,
          contentType: String
      }
  });
  module.exports =  mongoose.model("images", imageSchema);