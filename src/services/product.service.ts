import { ProductRepository } from "../repositories/product.repository";
import { WineRepository } from "../repositories/wine.repository";
import { Product } from "../models/product.model";

interface IGetAllProductsOptions {
  page: number;
  limit: number;
  filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  };
  sort?: string;
}

export class ProductService {
  private productRepository: ProductRepository;
  private wineRepository: WineRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.wineRepository = new WineRepository();
  }

  public async getAll(options: IGetAllProductsOptions) {
    const { page, limit, filters, sort } = options;
    const offset = (page - 1) * limit;

    const {products, total} = await this.productRepository.findAll({
      limit,
      offset,
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort,
    });

    return {
      meta: {
        total: total,
        per_page: limit,
        current_page: page,
        total_pages: Math.ceil(total / limit),
      },
      products,
    };
  }

  // public async getWines(): Promise<any[]> {
  //   const result = await this.productRepository.findAll({
  //     winesOrCategoryOne: true,
  //   });
  //   return result as any[];
  // }

  public async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  public async createProduct(data: any): Promise<any> {
    // Validar los campos requeridos
    if (!data.name || !data.category_id || data.price === undefined) {
      throw new Error("Nombre, categoría y precio son campos obligatorios.");
    }

    const { is_wine, varietal, winery, country, province, location } = data;

    // 1. Crear el Producto
    const newProduct = await this.productRepository.create(data);

    // 2. Si el Producto es un Vino, crear el registro
    if (is_wine) {
      const wineData = {
        product_id: newProduct.id,
        varietal,
        winery,
        country,
        province,
        location,
      };
      const newWine = await this.wineRepository.create(wineData);
      return { ...newProduct, ...newWine };
    }

    return newProduct;
  }

  public async updateProduct(
    id: number,
    data: Partial<Product>
  ): Promise<Product | null> {
    return await this.productRepository.update(id, data);
  }

  public async deleteProduct(id: number): Promise<boolean> {
    return await this.productRepository.delete(id);
  }
}
