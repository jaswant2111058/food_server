const items = require("../model/items");
const users = require("../model/user");
const orderList = require("../model/orderList");
const bcrypt = require('bcryptjs');


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


exports.showallItems = async (req, res, next) => {
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
        } = req.body
        console.log(req.body)

        if  (!name || !item_id || !user_id || !date || !startTime || !endTime || !fullAddress || !item_type || !price || !item_name || !img){
            return res.status(400).send({msg:"All fields are Required"})
        }

            //   const payment_verification = await payments.findOne({ payment_id })
            // if (payment_verification && payment_verification?.verification) 
            // {
            bcrypt.hash(user_id, 12, async function (err, hash) {
                if (err) {
                    console.error('Error generating hash code:', err);
                }
                else {
                    const details = {
                        name,
                        orderHash: hash,
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
                    }
                    const new_order = new orderList(details);
                    const data = await new_order.save()
                    console.log(data);
                    res.status(200).send(data);
                }
            })
        //  }

        // else {
        //     res.status(400).json("unauterized access");
        // }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

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
