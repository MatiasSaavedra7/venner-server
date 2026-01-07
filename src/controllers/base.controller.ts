import { Response } from "express";

export abstract class BaseController {
  // Método para manejar respuestas exitosas
  protected sendSuccess(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Método para manejar respuestas de error
  protected sendError(
    res: Response,
    message: string = "Internal Server Error",
    statusCode: number = 500,
    error?: any
  ): void {
    res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }
}
