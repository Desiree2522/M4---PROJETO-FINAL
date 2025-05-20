// authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoJWT';

export default function authMiddleware(req, res, next) {
  try {
    // Extração do token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Formato inválido. Use: Bearer <token>' });
    }

    // Verificação do token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Injeta informações do usuário na requisição
    req.userId = decoded.id;
    req.tipoUsuario = decoded.tipoUsuario;
    
    next();
    
  } catch (error) {
    // Tratamento de erros refinado
    const errorResponse = {
      'TokenExpiredError': { status: 401, message: 'Token expirado' },
      'JsonWebTokenError': { status: 401, message: 'Token inválido' },
      'NotBeforeError': { status: 401, message: 'Token não ativo' }
    }[error.name] || { status: 500, message: 'Erro de autenticação' };

    return res.status(errorResponse.status).json({ 
      error: errorResponse.message,
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}