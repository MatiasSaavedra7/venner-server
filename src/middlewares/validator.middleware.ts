import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const validateSchema = 
  (schema: ZodObject<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.issues.map((issue) => issue.message),
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }