// [*] Espone il servizio tramite HTTP

import { Router } from "express";
import { z } from "zod";
import { getWeatherForDate } from "../services/weather.service.js";

const router = Router();

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

router.get("/", async (req, res, next) => {
  try {
    const parsed = querySchema.safeParse({
      date: req.query.date
    });

    if (!parsed.success) {
      res.status(400).json({
        status: "invalid_date",
        message: "Specifica date nel formato YYYY-MM-DD."
      });
      return;
    }

    const result = await getWeatherForDate(parsed.data.date);

    if (
      result.status === "invalid_date" ||
      result.status === "date_in_past"
    ) {
      res.status(400).json(result);
      return;
    }

    if (result.status === "forecast_unavailable") {
      res.status(503).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
