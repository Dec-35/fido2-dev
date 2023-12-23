import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('register');
});

router.get('/getChallenge', (req, res) => {
  res.json({challenge: authController.generateChallenge(req.session)});
});

router.post('/login', authController.loginUser);

router.post('/register', authController.registerUser);

router.post('/register-device', authController.registerNewDevice);

export default router;
