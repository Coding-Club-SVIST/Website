import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import {
  globalRateLimiter,
  apiRateLimiter,
  authRateLimiter,
  authRoutesLimiter,
} from "./middlewares/rateLimit.middleware";
import { config } from "./config";
import logger from "./utils/logger";

const app: Application = express();
const extraOrigins = config.frontend.url ? config.frontend.url.split(',') : [];

app.use(
  cors({
    origin: [
        ...extraOrigins,
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";

    try {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: clientIp,
        userAgent: req.get("user-agent"),
      });
    } catch (error) {
      console.error("Logging error:", error);
    }
  });

  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

try {
  app.use(globalRateLimiter);
  app.use("/api/auth", authRoutesLimiter);
  app.use("/api", apiRateLimiter);
} catch (error) {
  console.error("Error loading rate limiter:", error);
}

app.use("/api", routes);

app.use(errorHandler);
app.use(notFound);

export default app;
