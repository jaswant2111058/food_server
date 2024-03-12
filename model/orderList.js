const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    orderHash: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    fullAddress: {
        type: Object,
        required: true
    },
    item_type: {
        type: String,
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    item_id: {
        type: String,
        required: true

    },
    price: {
        type: String,
        required: true
    },
    img: String,
    user_id: String,

},
    {
        timestamps: true
    });

const events = mongoose.model("posted_order", Schema);
module.exports = events