import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { validateProductionEnvironment } from "./env";
import { checkDatabaseConnection } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  validateProductionEnvironment();
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline' https:; connect-src 'self' https:;"
      );
    }
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  const requestCounts = new Map<string, { count: number; resetAt: number }>();
  app.use("/api/trpc", (req, res, next) => {
    if (req.method !== "GET") {
      const origin = req.get("origin");
      const protocol = String(req.headers["x-forwarded-proto"] ?? req.protocol).split(",")[0];
      const expectedOrigin = `${protocol}://${req.get("host")}`;
      if (origin && origin !== expectedOrigin) {
        res.status(403).json({ error: "Cross-site request blocked" });
        return;
      }
    }
    const key = `${req.ip}:${req.path}`;
    const isPublicSubmission = /(?:quote\.create|contact\.create|newsletter\.subscribe)/.test(
      req.originalUrl
    );
    const requestLimit = isPublicSubmission ? 10 : 120;
    const now = Date.now();
    const current = requestCounts.get(key);
    if (!current || current.resetAt <= now) {
      if (requestCounts.size > 10_000) {
        requestCounts.forEach((stored, storedKey) => {
          if (stored.resetAt <= now) requestCounts.delete(storedKey);
        });
      }
      requestCounts.set(key, { count: 1, resetAt: now + 60_000 });
      next();
      return;
    }
    if (current.count >= requestLimit) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }
    current.count += 1;
    next();
  });
  app.get(["/health", "/healthz"], (_req, res) => res.status(200).json({ ok: true }));
  app.get("/readyz", async (_req, res) => {
    if (!(await checkDatabaseConnection())) {
      res.status(503).json({ ok: false, reason: "database_unavailable" });
      return;
    }
    res.status(200).json({ ok: true });
  });
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000", 10);
  const port = process.env.NODE_ENV === "development"
    ? await findAvailablePort(preferredPort)
    : preferredPort;

  server.on("error", error => {
    console.error("[Server] Listener error", error);
    process.exit(1);
  });
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
  const shutdown = () => {
    server.close(error => {
      if (error) {
        console.error("[Server] Graceful shutdown failed", error);
        process.exitCode = 1;
      }
    });
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

startServer().catch(error => {
  console.error("[Server] Startup failed", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
