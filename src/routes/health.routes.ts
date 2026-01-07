import { Router, Request, Response } from "express";
import os from "os";
import { version as appVersion } from "../../package.json";
import pool from "../database/config/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const uptime = process.uptime();
  try {
    // Intenta hacer una consulta simple a la base de datos
    await pool.query("SELECT 1");

    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime)}s`,
      application: {
        version: appVersion,
        environment: process.env.NODE_ENV || "development",
      },
      resources: {
        database: {
          status: "connected",
          pool: {
            totalCount: pool.totalCount,
            idleCount: pool.idleCount,
            waitingCount: pool.waitingCount,
          },
        },
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
        // Tiempo de CPU acumulado en segundos
        cpu: {
          user: `${(cpuUsage.user / 1000000).toFixed(2)} s`,
          system: `${(cpuUsage.system / 1000000).toFixed(2)} s`,
        },
      },
      system: {
        node_version: process.version,
        platform: os.platform(),
        free_memory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
        total_memory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
      },
    });
  } catch (error) {
    // Si la base de datos falla, devuelve un estado de error 503
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime)}s`,
      application: {
        version: appVersion,
        environment: process.env.NODE_ENV || "development",
      },
      resources: {
        database: {
          status: "disconnected",
          error: (error as Error).message,
        },
      },
    });
  }
});

export default router;
