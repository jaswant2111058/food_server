const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    order:[
        {
            itemName:String,
            order_id:String,
            price:Number,
            img:String,
        },
    ]
},
{
    timestamps: true
});

const Users = mongoose.model("foodUser", Schema);
module.exports = Users