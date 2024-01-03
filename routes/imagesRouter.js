const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/imagesController')
const multer = require("multer");

const  storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null,"uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	}
});
const upload = multer({storage : storage });
router.post('/upload', upload.single('image'),
//userController.authMiddleware,
imagesController.upload
);
router.get('/img/:_id', 
    imagesController.preview
);

module.exports = router;
