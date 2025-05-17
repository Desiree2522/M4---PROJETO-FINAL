import express from 'express';
import authMiddleware from './middlewares/authMiddleware';
import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';

const routerUser = express.Router();

// ======================================
// Rotas Públicas (não requerem autenticação)
// ======================================
routerUser.post('/users', userController.createUser); // Registro de usuário
routerUser.post('/login', authController.login); // Login (gera token JWT)
routerUser.post('/reset-password', authController.resetPassword); // Reset de senha

// ======================================
// Rotas Protegidas (requerem token válido)
// ======================================
routerUser.get('/me', authMiddleware, userController.getLoggedUser); // Pega usuário logado
routerUser.get('/users', authMiddleware, userController.getUsers); // Lista usuários (restringir para ADMIN depois)
routerUser.put('/users/:id', authMiddleware, userController.editUser); // Edita usuário
routerUser.delete('/users/:id', authMiddleware, userController.deleteUser); // Deleta usuário

export default routerUser;
