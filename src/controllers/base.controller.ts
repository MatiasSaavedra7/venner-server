import { Response } from "express";

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export abstract class BaseController {
  // Método para manejar respuestas exitosas
  protected success<T>(
    res: Response,
    data: T,
    meta?: PaginationMeta | null,
    message?: string | null,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message: message || null,
      meta: meta || null,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Método para manejar respuestas de error
  protected error(
    res: Response,
    message: string,
    status_code: number = 500,
    details: any = null
  ): Response {
    return res.status(status_code).json({
      success: false,
      error: {
        code: status_code,
        message,
        details
      },
      timestamp: new Date().toISOString(),
    });
  }
}
