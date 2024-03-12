const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const userController = require('../controllers/user');
const webyapar = require ("../controllers/webyapar")
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




router.post('/auth/user/signup',
  userController.signup
  )


router.post('/auth/user/login',
  [
    body('email').exists().withMessage('email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
 
  userController.login
);



router.post('/form',upload.single('image'),
  [
    body("longitude").exists().withMessage('email is required'),
    body('latitude').exists().withMessage('Password is required'),
    body('image').exists().withMessage('Password is required'),
  ],
  userController.authMiddleware,
  webyapar.uploadImg,
  webyapar.saveData
);


router.get('/data',
  userController.authMiddleware,
  webyapar.showData
);


module.exports = router;