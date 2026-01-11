import { Pool } from "pg";
import pool from "../database/config/db";
import { ICrudRepository } from "../interfaces/crud.interface";

export abstract class BaseRepository<T> implements ICrudRepository<T> {
  protected db: Pool;

  constructor() {
    this.db = pool;
  }

  abstract findAll(options?: any): Promise<T[] | { products: T[]; total: number }>;
  abstract findById(id: number): Promise<T | null>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: number, data: Partial<T>): Promise<T | null>;
  abstract delete(id: number): Promise<boolean>;
}
