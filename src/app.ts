
import express from "express";
import healthRouter from "./routes/health.routes.js";
import weatherRouter from "./routes/weather.routes.js";

const app = express();

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/weather", weatherRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found",
    },
  });
});

export default app;
