const express = require('express');
const userController = require('../Controller/userController');
const authController = require('../Controller/authController');

const router = express.Router();

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsersData);

router.route('/:id').get(userController.getUser);

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/decrypt', userController.decrypt);

router.post('/saveDocument', userController.saveDocument);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

module.exports = router;
