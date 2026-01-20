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
      this.success(res, wines, null, "Vinos obtenidos con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener los vinos", 500, error);
    }
  };

  public getByProductId = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const wine = await this.wineService.getWineByProductId(productId);
      if (!wine) {
        return this.error(res, "Detalles del vino no encontrados", 404);
      }
      this.success(res, wine, null, "Vino obtenido con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener el vino", 500, error);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const wine = await this.productService.createProduct(req.body);
      this.success(res, wine, null, "Vino creado con éxito", 201);
    } catch (error: any) {
      this.error(res, "Error al crear el vino", 500, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const wine = await this.wineService.updateWine(productId, req.body);
      if (!wine) {
        return this.error(res, "Detalles del vino no encontrados", 404);
      }
      this.success(res, wine, null, "Detalles del vino actualizados con éxito", 200);
    } catch (error) {
      this.error(res, "Error al actualizar los detalles del vino", 500, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const productId = Number(req.params.id);
      const deleted = await this.wineService.deleteWine(productId);
      if (!deleted) {
        return this.error(res, "Detalles del vino no encontrados", 404);
      }
      this.success(res, null, null, "Detalles del vino eliminados con éxito", 200);
    } catch (error) {
      this.error(res, "Error al eliminar los detalles del vino", 500, error);
    }
  };
}
