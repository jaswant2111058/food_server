const images = require("../model/images");
const fs = require("fs");
const path = require("path");
const Users = require("../model/user");


exports.uploadImg = async (req, res, next) => {

   try {
        const obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname, '../uploads/' + req.file.filename)),
                contentType: "image/png"
            }
        }
        const id = await images.create(obj)
        fs.unlinkSync(path.join(__dirname, '../uploads/' + req.file.filename))
        req.imgURL = id._id
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}



exports.saveData = async (req, res) => {

    try {
        const { latitude, longitude, } = req.body
        const data = {
            latitude,
            longitude,
            imageUrl: req.imgURL
        }
        const fetchUser = await Users.findOne({email:req.email})
        const webyapar = fetchUser.webyapar
        webyapar.push(data)
        await Users.updateOne({email:req.email}, {webyapar:webyapar})
        res.send({
            message:"data saved successfuly"
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}


exports.showData = async (req, res) => {

    try {
        const userData = await Users.findOne({ email: req.email })
        res.send({
            content: userData?.webyapar
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message
        })
    }
}

