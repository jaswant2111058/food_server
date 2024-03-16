
const images = require("../model/images");
const fs = require("fs");
const path = require("path");
const { Types } = require('mongoose');

exports.upload = async (req, res, next) => {

    try {
        const obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname, '../uploads/' + req.file.filename)),
                contentType: "image/png"
            }
        }
        const id = await images.create(obj)
        fs.unlinkSync(path.join(__dirname, '../uploads/' + req.file.filename))
        res.send(id._id)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

exports.preview = async (req, res) => {
    try {
        const _id = req.params._id
        if (!Types.ObjectId.isValid(_id)) {
            return res.status(400).send({
                message: "Invalid Order Id"
            });
        }
        const image = await images.findOne({ _id })
        res.send(image.img.data)
    }
    catch (e) {
        res.send(
            'enter query is not correct'
        )
    }
}