import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../models/users.model";

// Extendemos la interfaz Request de Express para añadir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
    }
  }
}

export interface AuthRequest extends Request {
  user: Omit<User, "password">;
}

export const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Obtenemos el token de las cookies
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso denegado: No hay token, autorización denegada" });
    }

    // 2. Verificamos el token usando la clave secreta
    const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;

    // 3. Buscamos al usuario en la base de datos con el ID del token
    const userRepository = new UserRepository();
    const userFound = await userRepository.findById(decoded.id);

    if (!userFound) {
      return res.status(401).json({ message: "Acceso denegado: No autorizado, usuario no encontrado" });
    }

    // 4. Adjuntamos los datos del usuario (sin el password) al objeto 'req' para que las siguientes funciones (controllers) puedan usarlo.
    const { password, ...secureUser } = userFound;
    req.user = secureUser;

    // 5. Si todo es correcto, continuamos a la siguiente función (el controlador)
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Acceso denegado: El Token no es válido o ha expirado" });
  }
};

export const adminRequired = (req: Request, res: Response, next: NextFunction) => {
  console.log("USER: ", req.user);
  
  if (!req.user) {
    return res.status(401).json({ message: "Acceso denegado: Usuario no autenticado" });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({ message: "Acceso denegado: Se requiere permisos de administrador" });
  }

  next();
};

export const guestRequired = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      jwt.verify(token, TOKEN_SECRET);
      return res.status(400).json({ message: "Ya has iniciado sesión" });
    } catch (error) {
      return next();
    }
  }
  next();
};
