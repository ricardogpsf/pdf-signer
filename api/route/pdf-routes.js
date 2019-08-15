const express = require('express');
const controller = require('../controller/pdf-controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const Router = express.Router();

Router.post('/sign', multipartMiddleware, controller.sign);
Router.post('/verify', multipartMiddleware, controller.verify);
Router.get('/public-key', controller.getPublicKey);

module.exports = Router;