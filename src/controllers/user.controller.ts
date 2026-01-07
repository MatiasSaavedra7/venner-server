import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this.userService.register(req.body);

      res.cookie("token", token, {
        httpOnly: true,
      });

      const userData = {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin,
      };

      this.sendSuccess(res, userData, "Usuario registrado con éxito", 201);
    } catch (error: any) {
      if (error.message.includes("ya esta en uso")) {
        return this.sendError(res, error.message, 409);
      }
      this.sendError(res, "Error al registrar el usuario", 500, error);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this.userService.login(req.body);

      res.cookie("token", token, {
        httpOnly: true,
      });

      const userData = {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin,
      };

      this.sendSuccess(res, userData, "Inicio de sesión exitoso");
    } catch (error: any) {
      this.sendError(res, error.message, 401);
    }
  };

  public logout = (req: Request, res: Response): void => {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    res.sendStatus(200);
  };

  public profile = async (req: Request, res: Response): Promise<void> => {
    try {
      // El middleware 'authRequired' ya ha verificado el token y adjuntado el usuario a req.user
      const user = req.user;

      if (!user) {
        // Esta comprobación es redundante si authRequired funciona, pero es una buena salvaguarda.
        return this.sendError(res, "No autorizado, usuario no encontrado en la solicitud", 401);
      }

      this.sendSuccess(res, user, "Perfil de usuario obtenido con éxito");
    } catch (error: any) {
      this.sendError(res, "Error al obtener el perfil", 500, error);
    }
  };

  public verifyToken = (req: Request, res: Response): void => {
    // El middleware 'authRequired' ya ha verificado el token y el usuario.
    // Si llegamos aquí, el token es válido. Simplemente devolvemos los datos del usuario.
    if (req.user) {
      this.sendSuccess(res, req.user, "Token verificado");
    }
  };
}
