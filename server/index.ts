import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import type { Server } from "http";
import compression from "compression";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import { handleHealthRequest } from "./health";

const app = express();

// Add compression middleware to reduce response sizes
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register health check routes immediately to avoid Vite middleware interference
app.get('/api/health', handleHealthRequest);
app.get('/health', handleHealthRequest);
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'United Bethel Presbyterian Church API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register API routes first, before any other middleware
  const server = await registerRoutes(app);
  let isShuttingDown = false;

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    try {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } catch (error) {
      console.error("Failed to setup Vite in development:", error);
      // Fallback to static serving if Vite fails
      const { serveStatic } = await import("./vite");
      serveStatic(app);
    }
  } else {
    const { serveStatic } = await import("./vite");
    serveStatic(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Railway will set PORT automatically. Default to 3000 for local development.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
  
  server.listen(port, '0.0.0.0', () => {
    log(`[express] serving on port ${port}`);
    log(`[express] Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`[express] Health check available at: http://0.0.0.0:${port}/api/health`);
  });

  server.on('error', (error: any) => {
    log(`[express] Server error: ${error.message}`);
    if (error.code === 'EADDRINUSE') {
      log(`[express] Port ${port} is already in use`);
    }
  });

  const shutdown = (signal: string, exitCode = 0) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    log(`[express] Received ${signal}, shutting down gracefully`);

    const forceExitTimer = setTimeout(() => {
      log('[express] Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);

    server.close((error) => {
      clearTimeout(forceExitTimer);
      if (error) {
        log(`[express] Error during shutdown: ${error.message}`);
        process.exit(1);
        return;
      }

      log('[express] Shutdown complete');
      process.exit(exitCode);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
})();
