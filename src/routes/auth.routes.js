import express from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = express.Router();

// Rota pública
router.post('/login', AuthController.login);

export default router;