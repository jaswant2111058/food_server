const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const indexController = require('../controllers/index');
const userController = require('../controllers/user');




router.get('/getitem',
  indexController.showItems
)


router.get('/getallitem',
  indexController.showallItems
)


router.get('/getorderlist',

  userController.authMiddleware,
  indexController.getOrderList  
)



router.post('/placeorder',

  userController.authMiddleware,
  indexController.placeOrder
);






module.exports = router;