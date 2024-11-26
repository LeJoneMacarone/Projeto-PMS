
const express = require('express');
const { uploadDocument, multerErrorHandlerIdDocument } = require('../middlewares/upload');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.get('/login', userController.renderLoginPage);

router.get('/register', userController.renderRegisterPage);

router.get('/profile', userController.renderRegisterPage);

router.post('/login', userController.login);

router.post('/register', uploadDocument.single('id_document'), multerErrorHandlerIdDocument , userController.register);

router.get('/logout', userController.logout)

module.exports = router;
