import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { OrderService } from "../services/order.service";
import { BaseController } from "./base.controller";

export class OrderController extends BaseController {
  private orderService: OrderService;

  constructor() {
    super();
    this.orderService = new OrderService();
  }

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const { items } = req.body;
      
      const order = await this.orderService.createOrder(userId, items);
      this.success(res, order, null, "Orden creada con éxito", 201);
    } catch (error: any) {
      this.error(res, "Error al crear la orden", 400, error);
    }
  };

  public getByCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const orders = await this.orderService.getOrdersByUser(userId);
      this.success(res, orders, null, "Ordenes obtenidas con éxito", 200);
    } catch (error: any) {
      this.error(res, "Error al obtener las ordenes", 500, error);
    }
  };

  public getById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isAdmin = req.user.is_admin;
      
      const order = await this.orderService.getOrderById(Number(id), userId, isAdmin);
      
      if (!order) {
        this.error(res, "No se encontro la orden", 404);
        return;
      }
      
      this.success(res, order, null, "Orden obtenida con éxito", 200);
    } catch (error: any) {
      if (error.message.includes("Acceso denegado")) {
        this.error(res, "Acceso denegado", 403, error);
      } else {
        this.error(res, "Error al obtener la orden", 500, error);
      }
    }
  };

  public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.orderService.getAllOrders(page, limit);
      this.success(res, result, null, "Ordenes obtenidas con éxito", 200);
    } catch (error: any) {
      this.error(res, "Error al obtener las ordenes", 500, error);
    }
  };
}
