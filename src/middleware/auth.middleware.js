import jwt from 'jsonwebtoken';
import authorizationService from '../services/authorization.service';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new Error('Token não fornecido');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Não autorizado' });
  }
};

export const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await authorizationService.hasPermission(
        req.user.id,
        permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Você não tem permissão para realizar esta ação' 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao verificar permissões' });
    }
  };
}; 