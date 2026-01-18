import type { Request, Response } from "express";
import { checkDatabaseHealth } from "./storage";

export type HealthPayload = {
  status: "healthy" | "degraded";
  timestamp: string;
  uptime: number;
  port: string;
  environment: string;
  dependencies: {
    database: Awaited<ReturnType<typeof checkDatabaseHealth>>;
  };
};

export async function buildHealthPayload(): Promise<HealthPayload> {
  const database = await checkDatabaseHealth();
  const status = database.status === "healthy" ? "healthy" : "degraded";

  return {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: process.env.PORT || "3000",
    environment: process.env.NODE_ENV || "development",
    dependencies: { database },
  };
}

export async function handleHealthRequest(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const payload = await buildHealthPayload();
    res.set("Cache-Control", "no-store");
    // Always return 200 so platform health checks don't recycle the container
    // when the database is temporarily unavailable.
    res.status(200).json(payload);
  } catch (error: any) {
    res
      .status(200)
      .json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error?.message ?? "Health check failed",
      });
  }
}
