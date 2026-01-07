import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { WineService } from "../services/wine.service";
import { ProductService } from "../services/product.service";

export class WineController extends BaseController {
  private wineService: WineService;
  private productService: ProductService;

  constructor() {
    super();
    this.wineService = new WineService();
    this.productService = new ProductService();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const wines = await this.wineService.getAllWines();
      this.sendSuccess(res, wines);
    } catch (error) {
      this.sendError(res, "Error al obtener los vinos", 500, error);
    }
  };

  public getByProductId = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const wine = await this.wineService.getWineByProductId(productId);
      if (!wine) {
        return this.sendError(res, "Detalles del vino no encontrados", 404);
      }
      this.sendSuccess(res, wine);
    } catch (error) {
      this.sendError(res, "Error al obtener el vino", 500, error);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const wine = await this.productService.createProduct(req.body);
      this.sendSuccess(res, wine, "Vino creado con éxito", 201);
    } catch (error: any) {
      this.sendError(res, "Error al crear el vino", 500, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const wine = await this.wineService.updateWine(productId, req.body);
      if (!wine) {
        return this.sendError(res, "Detalles del vino no encontrados", 404);
      }
      this.sendSuccess(res, wine, "Detalles del vino actualizados con éxito");
    } catch (error) {
      this.sendError(res, "Error al actualizar los detalles del vino", 500, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const deleted = await this.wineService.deleteWine(productId);
      if (!deleted) {
        return this.sendError(res, "Detalles del vino no encontrados", 404);
      }
      this.sendSuccess(res, null, "Detalles del vino eliminados con éxito");
    } catch (error) {
      this.sendError(res, "Error al eliminar los detalles del vino", 500, error);
    }
  };
}
