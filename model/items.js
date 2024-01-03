const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    itemName : {
        type: String,
        required: true
    },
    
    item_type:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true

    },
    img:{
        type: String,
        required: true
    },
},
{
    timestamps: true
});

const events = mongoose.model("fooditems", Schema);
module.exports = events