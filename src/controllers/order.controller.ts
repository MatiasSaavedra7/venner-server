import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { OrderService } from "../services/order.service";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const { items } = req.body;
      
      const order = await this.orderService.createOrder(userId, items);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public getByCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const orders = await this.orderService.getOrdersByUser(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const order = await this.orderService.getOrderById(Number(id));
      
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.orderService.getAllOrders(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
