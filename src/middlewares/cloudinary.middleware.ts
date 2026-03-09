import multer, { Multer } from "multer";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import sharp from "sharp";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config";
import { NextFunction, Request, Response } from "express";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

// Configurar multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Inicializar multer
export const upload: Multer = multer({ storage: storage });

// Sube un buffer a Cloudinary y devuelve la URL segura
const uploadBufferToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "venner" },
      (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (err) return reject(err);
        if (!result) return reject(new Error("Cloudinary upload result is undefined"));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

// Middleware para subir archivos a Cloudinary
export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files: CloudinaryFile[] = req.files as CloudinaryFile[];

    if (!files || files.length === 0) {
      return next(new Error("No se subieron archivos."));
    }

    // Redimensionar y subir todas las imágenes en paralelo
    const cloudinaryUrls = await Promise.all(
      files.map(async (file) => {
        const resizedBuffer = await sharp(file.buffer)
          .resize({ width: 800, height: 600 })
          .toBuffer();
        return uploadBufferToCloudinary(resizedBuffer);
      }),
    );

    // Agregar las URLs a req.body y continuar
    req.body.cloudinaryUrls = cloudinaryUrls;
    next();
  } catch (error) {
    console.error("Error en uploadToCloudinary middleware:", error);
    next(error);
  }
};
