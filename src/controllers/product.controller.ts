import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ProductService } from "../services/product.service";

export class ProductController extends BaseController {
  private productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const {
        page = "1",
        limit = "10",
        search,
        category,
        minPrice,
        maxPrice,
        sort,
      } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const options = {
        page: pageNumber,
        limit: limitNumber,
        filters: {
          search: search as string | undefined,
          category: category as string | undefined,
          minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        },
        sort: sort as string | undefined,
      };

      const { products, meta } = await this.productService.getAll(options);

      this.success(res, products, meta, "Productos obtenidos con éxito", 200)
    } catch (error) {
      console.log(error)
      this.error(res, "Error al obtener los productos", 500, error);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      // Capturar el ID del Producto
      const id = Number(req.params.id);

      // Obtener el Producto
      const product = await this.productService.getProductById(id);

      // Validar si el Producto existe
      if (!product) {
        return this.error(res, "Producto no encontrado", 404);
      }

      this.success(res, product, null, "Producto obtenido con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener el producto", 500, error);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      // Crear el Producto
      const product = await this.productService.createProduct(req.body);

      this.success(res, product, null, "Producto creado con éxito", 201);
    } catch (error: any) {
      if (error.message.includes("required")) {
        return this.error(res, error.message, 400);
      }
      this.error(res, "Error al crear el producto", 500, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const product = await this.productService.updateProduct(id, req.body);
      if (!product) {
        return this.error(res, "Producto no encontrado", 404);
      }
      this.success(res, product, null, "Producto actualizado con éxito", 200);
    } catch (error) {
      this.error(res, "Error al actualizar el producto", 500, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.productService.deleteProduct(id);
      if (!deleted) {
        return this.error(res, "Producto no encontrado", 404);
      }
      this.success(res, null, null, "Producto eliminado con éxito", 200);
    } catch (error) {
      this.error(res, "Error al eliminar el producto", 500, error);
    }
  };
}
