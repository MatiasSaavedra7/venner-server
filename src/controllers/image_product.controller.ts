import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { ImageProductService } from "../services/image_product.service";

export class ImageProductController extends BaseController {
  private imageService: ImageProductService;

  constructor() {
    super();
    this.imageService = new ImageProductService();
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const images = await this.imageService.getAllImages();
      this.success(res, images, null, "Imagenes obtenidas con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener las imágenes", 500, error);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const image = await this.imageService.getImageById(id);
      if (!image) {
        return this.error(res, "Imagen no encontrada", 404);
      }
      this.success(res, image, null, "Imagen obtenida con éxito", 200);
    } catch (error) {
      this.error(res, "Error al obtener la imagen", 500, error);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const image = await this.imageService.createImage(req.body);
      this.success(res, image, null, "Imagen agregada con éxito", 201);
    } catch (error: any) {
      if (error.message.includes("required")) {
        return this.error(res, error.message, 400);
      }
      this.error(res, "Error al agregar la imagen", 500, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const image = await this.imageService.updateImage(id, req.body);
      if (!image) {
        return this.error(res, "Imagen no encontrada", 404);
      }
      this.success(res, image, null, "Imagen actualizada con éxito", 200);
    } catch (error) {
      this.error(res, "Error al actualizar la imagen", 500, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.imageService.deleteImage(id);
      if (!deleted) {
        return this.error(res, "Imagen no encontrada", 404);
      }
      this.success(res, null, null, "Imagen eliminada con éxito", 200);
    } catch (error) {
      this.error(res, "Error al eliminar la imagen", 500, error);
    }
  };
}
