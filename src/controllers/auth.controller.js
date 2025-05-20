import jwt from 'jsonwebtoken';
import { getUserByEmailService } from '../service/user.service.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoJWT';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // 1. Validação básica
      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // 2. Busca usuário
      const user = await getUserByEmailService(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // 3. Verifica senha
      const passwordMatch = await bcrypt.compare(senha, user.senha);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // 4. Gera token
      const token = jwt.sign(
        {
          id: user.id,
          tipoUsuario: user.tipo
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 5. Retorna resposta (sem a senha)
      return res.json({
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        },
        token
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  async resetPassword(req, res) {
    try {
      const { email } = req.body;
      console.log(`Solicitação de reset de senha para o email: ${email}`);
      // Aqui você implementará a lógica real de reset de senha
      return res.json({ message: 'Solicitação de reset de senha recebida' });
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      return res.status(500).json({ error: 'Erro ao processar a solicitação de reset de senha' });
    }
  }
}

export default new AuthController();