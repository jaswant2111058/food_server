const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const indexController = require('../controllers/index');




router.get('/getitem',
indexController.showItems
  )
router.get('/getallitem',
indexController.showallItems
  )
router.post('/placeorder',
indexController.placeOrder
);






module.exports = router;