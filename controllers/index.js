const items = require("../model/items");
const users = require("../model/user");
const orderList = require("../model/orderList");
const bcrypt = require('bcrypt');


exports.showItems = async (req, res, next) => {
    try {
        const field = req.query.field
        const query = req.query.q

        console.log(req.query)
        if (field === "All") {
            const itemList = await items.find({ itemName: { $regex: query, $options: 'i' } })
            console.log(itemList)
            res.status(200).send(itemList)
        }
        else if (field === "price") {
            const itemList = await items.find({ price: { $regex: parseInt(query), $options: 'i' } })
            console.log(itemList)
            res.status(200).send(itemList)
        }
        else {
            const itemList = await items.find({
                $and: [
                    { item_type: field },
                    { itemName: { $regex: query, $options: 'i' } }
                ]
            })
            //  console.log(itemList)
            res.status(200).send(itemList)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}


exports.showallItems = async (req, res) => {
    try {
        const itemList = await items.find({}).limit(20);
        res.status(200).send(itemList)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.placeOrder = async (req, res) => {
    try {
        const {
            name,
            item_id,
            user_id,
            date,
            startTime,
            endTime,
            fullAddress,
            item_type,
            price,
            item_name,
            img,
        } = req.body;

        // Check if all required fields are present
        const requiredFields = [name, item_id, user_id, date, startTime, endTime, fullAddress, item_type, price, item_name, img];
        if (requiredFields.some(field => !field)) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Generate hash for user_id
        const hashedUserId = await bcrypt.hash(user_id, 12);

        // Create order details
        const orderDetails = {
            name,
            orderHash: hashedUserId,
            item_id,
            user_id,
            date,
            startTime,
            endTime,
            fullAddress,
            item_type,
            price,
            item_name,
            img,
            status: false,
        };

        // Save order to database
        const newOrder = new orderList(orderDetails);
        const savedOrder = await newOrder.save();

        // Update user's order list
       const userData = await users.findOneAndUpdate(
            { email: req.email },
            { $push: { order: { itemName: item_name, order_id: savedOrder._id, price, img } } },
            { new: true }
        );

        res.status(200).json(savedOrder);
        console.log(userData)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getOrder = async (req, res) => {

    try {
        const { order_id } = req.body.order_id;
        const order = await orderList.findOne({ _id: order_id })
        res.status(200).send(order)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOrderList = async (req, res) => {

    try {
        const order = await users.findOne({ email: req.email })
        console.log(order)
        res.status(200).send(order.order)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }

}
