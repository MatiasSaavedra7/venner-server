import { CategoryRepository } from "../repositories/category.repository";
import { Category } from "../models/category.model";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  public async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  public async getCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findById(id);
  }

  public async createCategory(data: Partial<Category>): Promise<Category> {
    if (!data.name) {
      throw new Error("El nombre de la categoría es obligatorio.");
    }
    return await this.categoryRepository.create(data);
  }

  public async updateCategory(
    id: number,
    data: Partial<Category>
  ): Promise<Category | null> {
    return await this.categoryRepository.update(id, data);
  }

  public async deleteCategory(id: number): Promise<boolean> {
    return await this.categoryRepository.delete(id);
  }
}
