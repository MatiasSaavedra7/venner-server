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
      this.sendSuccess(res, categories);
    } catch (error) {
      this.sendError(res, "Error al obtener las categorías", 500, error);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return this.sendError(res, "Categoría no encontrada", 404);
      }
      this.sendSuccess(res, category);
    } catch (error) {
      this.sendError(res, "Error al obtener la categoría", 500, error);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      this.sendSuccess(res, category, "Categoría creada con éxito", 201);
    } catch (error: any) {
      if (error.message === "Name is required") {
        return this.sendError(res, error.message, 400);
      }
      this.sendError(res, "Error al crear la categoría", 500, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoryService.updateCategory(id, req.body);
      if (!category) {
        return this.sendError(res, "Categoría no encontrada", 404);
      }
      this.sendSuccess(res, category, "Categoría actualizada con éxito");
    } catch (error) {
      this.sendError(res, "Error al actualizar la categoría", 500, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.categoryService.deleteCategory(id);
      if (!deleted) {
        // Could specify constraint violation vs not found
        return this.sendError(
          res,
          "Categoría no encontrada o no pudo ser eliminada",
          404
        );
      }
      this.sendSuccess(res, null, "Categoría eliminada con éxito");
    } catch (error) {
      this.sendError(res, "Error al eliminar la categoría", 500, error);
    }
  };
}
