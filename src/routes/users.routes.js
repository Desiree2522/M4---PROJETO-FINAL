import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const routerUser = express.Router();

// ======================================
// Rotas Públicas (não requerem autenticação)
// ======================================
routerUser.post('/', userController.createUser); // Registro de usuário
routerUser.post('/login', authController.login); // Login (gera token JWT)
routerUser.post('/reset-password', authController.resetPassword); // Reset de senha

// ======================================
// Rotas Protegidas (requerem token válido)
// ======================================
routerUser.get('/me', authMiddleware, userController.getLoggedUser); // Pega usuário logado
routerUser.get('/users', authMiddleware, userController.getUsers); // Lista usuários (restringir para ADMIN depois)
routerUser.put('/users/:id', userController.editUser); // Edita usuário
routerUser.delete('/users/:id', authMiddleware, userController.deleteUser); // Deleta usuário

export default routerUser;
