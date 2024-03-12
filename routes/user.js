const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const userController = require('../controllers/user');




router.post('/signup',
  userController.signup
  )

router.post('/googlelogin',
  [
    body('idToken').exists().withMessage('idToken is required'),
  ],
  userController.googlelogin
);


router.post('/login',
  [
    body('email').exists().withMessage('email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
 
  userController.login
);




router.get('/email/verification',
userController.verifySave
);

module.exports = router;