import { WineRepository } from "../repositories/wine.repository";
import { Wine } from "../models/wine.model";

export class WineService {
  private wineRepository: WineRepository;

  constructor() {
    this.wineRepository = new WineRepository();
  }

  public async getAllWines(): Promise<Wine[]> {
    return await this.wineRepository.findAll();
  }

  public async getWineByProductId(product_id: number): Promise<Wine | null> {
    return await this.wineRepository.findById(product_id);
  }

  public async createWine(data: Partial<Wine>): Promise<Wine> {
    if (!data.product_id) {
      throw new Error("El ID del Producto es obligatorio.");
    }
    return await this.wineRepository.create(data);
  }

  public async updateWine(
    product_id: number,
    data: Partial<Wine>
  ): Promise<Wine | null> {
    return await this.wineRepository.update(product_id, data);
  }

  public async deleteWine(product_id: number): Promise<boolean> {
    return await this.wineRepository.delete(product_id);
  }
}
