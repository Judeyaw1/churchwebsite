import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    // Dynamically import Vite modules only when needed
    const { createServer: createViteServer, createLogger } = await import("vite");
    const { nanoid } = await import("nanoid");
    
    // Create a minimal vite config inline to avoid importing vite.config.ts
    // ESM-compatible __dirname replacement
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const viteConfig = {
      plugins: [],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "..", "client", "src"),
          "@shared": path.resolve(__dirname, "..", "shared"),
          "@assets": path.resolve(__dirname, "..", "attached_assets"),
        },
      },
      root: path.resolve(__dirname, "..", "client"),
      build: {
        outDir: path.resolve(__dirname, "..", "dist", "public"),
        emptyOutDir: true,
      },
    };
  
  const viteLogger = createLogger();
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
    // Exclude API routes from Vite middleware
    base: '/',
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Only apply Vite middleware to non-API routes and non-upload routes
  app.use((req, res, next) => {
    const url = req.originalUrl;
    
    // Skip Vite middleware for health check, API routes, and uploads
    if (url === '/health' || url.startsWith('/api/') || url === '/api' || url.startsWith('/uploads/')) {
      return next();
    }
    
    // Apply Vite middleware to all other routes
    vite.middlewares(req, res, next);
  });
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    // Skip Vite middleware for health check and API routes
    if (url === '/health' || url.startsWith('/api/') || url === '/api') {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
  } catch (error) {
    console.error("Failed to setup Vite:", error);
    throw error;
  }
}

export function serveStatic(app: Express) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      index: false,
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
      },
    }),
  );

  app.get("/", (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  // fall through to index.html if the request expects HTML
  app.get("*", (req, res, next) => {
    if (!req.accepts("html")) {
      return next();
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  app.use((req, res) => {
    res.status(404).end();
  });
}
