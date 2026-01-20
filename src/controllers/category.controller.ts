import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { CategoryService } from "../services/category.service";

export class CategoryController extends BaseController {
  private categoryService: CategoryService;

  constructor() {
    super();
    this.categoryService = new CategoryService();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      this.success(res, categories, null, "Categorías obtenidas con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener las categorías", 500, error);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return this.error(res, "Categoría no encontrada", 404);
      }
      this.success(res, category, null, "Categoría obtenida con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener la categoría", 500, error);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      this.success(res, category, null, "Categoría creada con éxito", 201);
    } catch (error: any) {
      if (error.message === "Name is required") {
        return this.error(res, error.message, 400);
      }
      this.error(res, "Error al crear la categoría", 500, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoryService.updateCategory(id, req.body);
      if (!category) {
        return this.error(res, "Categoría no encontrada", 404);
      }
      this.success(res, category, null, "Categoría actualizada con éxito", 200);
    } catch (error) {
      this.error(res, "Error al actualizar la categoría", 500, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.categoryService.deleteCategory(id);
      if (!deleted) {
        // Could specify constraint violation vs not found
        return this.error(
          res,
          "Categoría no encontrada o no pudo ser eliminada",
          404
        );
      }
      this.success(res, null, null, "Categoría eliminada con éxito", 200);
    } catch (error) {
      this.error(res, "Error al eliminar la categoría", 500, error);
    }
  };
}
