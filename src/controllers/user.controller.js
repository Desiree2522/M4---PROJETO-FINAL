import {
  createUserService,
  getUserByEmailService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService
} from '../service/user.service.js';
import bcrypt from 'bcryptjs';

class UserController {
  // Criar usuário
  async createUser(req, res) {
    try {
      console.log('Dados recebidos:', req.body);

      // Mapeia os nomes dos campos para o padrão do service
      const { name: nome, email, password: senha, tipoUsuario: tipo } = req.body;

      // Validações
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      if (!['ADMIN', 'DOADOR', 'DONATARIO'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }

      // Verifica se usuário existe usando o service
      const existingUser = await getUserByEmailService(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Cria hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Cria o usuário usando o service
      const user = await createUserService({
        nome,
        email,
        senha: hashedPassword,
        tipo
      });

      return res.status(201).json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      });

    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter usuário logado
  async getLoggedUser(req, res) {
    try {
      const user = await getUserByIdService(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Formata a resposta para manter consistência
      return res.json({
        id: user.id,
        name: user.nome,
        email: user.email,
        tipoUsuario: user.tipo
      });

    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Listar usuários (apenas ADMIN)
  async getUsers(req, res) {
    try {
      const users = await getAllUsersService();

      // Formata a resposta para manter consistência
      const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.nome,
        email: user.email,
        tipoUsuario: user.tipo
      }));

      return res.json(formattedUsers);

    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Editar usuário
  async editUser(req, res) {
    try {
      // Converte os nomes dos campos se necessário
      const updateData = req.body;
      if (updateData.name) updateData.nome = updateData.name;
      if (updateData.tipoUsuario) updateData.tipo = updateData.tipoUsuario;
      
      const updatedUser = await updateUserService(req.params.id, updateData);

      return res.json({
        id: updatedUser.id,
        name: updatedUser.nome,
        email: updatedUser.email,
        tipoUsuario: updatedUser.tipo
      });

    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Deletar usuário
  async deleteUser(req, res) {
    try {
      await deleteUserService(req.params.id);
      return res.json({ message: 'Usuário deletado com sucesso' });

    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({ 
        error: 'Erro interno no servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default new UserController();