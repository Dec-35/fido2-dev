import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';

app.post('/login', authController.login);

app.post('/register', authController.register);

app.post('/register-device', authController.registerDevice);
