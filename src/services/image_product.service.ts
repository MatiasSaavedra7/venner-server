import { ImageProductRepository } from "../repositories/image_product.repository";
import { ImageProduct } from "../models/image_product.model";

export class ImageProductService {
  private imageProductRepository: ImageProductRepository;

  constructor() {
    this.imageProductRepository = new ImageProductRepository();
  }

  public async getAllImages(): Promise<ImageProduct[]> {
    return await this.imageProductRepository.findAll();
  }

  public async getImageById(id: number): Promise<ImageProduct | null> {
    return await this.imageProductRepository.findById(id);
  }

  public async createImage(data: Partial<ImageProduct>): Promise<ImageProduct> {
    if (!data.product_id || !data.url) {
      throw new Error("El ID del Producto y la URL son obligatorios.");
    }
    return await this.imageProductRepository.create(data);
  }

  public async updateImage(
    id: number,
    data: Partial<ImageProduct>
  ): Promise<ImageProduct | null> {
    return await this.imageProductRepository.update(id, data);
  }

  public async deleteImage(id: number): Promise<boolean> {
    return await this.imageProductRepository.delete(id);
  }
}
