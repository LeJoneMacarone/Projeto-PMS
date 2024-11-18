const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/login', userController.renderLoginPage);

router.get('/register', userController.renderRegisterPage);

router.get('/profile', userController.renderRegisterPage);

router.post('/login', userController.login);

router.post('/register', userController.register);

router.post('/logout', userController.logout)

module.exports = router;
