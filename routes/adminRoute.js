const express = require('express');
const authController = require('../Controller/authController');
const adminController = require('../Controller/adminController');

const router = express.Router();

router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/encrypt', adminController.encrypt);

module.exports = router;
