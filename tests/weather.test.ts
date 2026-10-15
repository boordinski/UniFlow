// [v] Verifica che tutto funzioni


import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/providers/weather.provider.js", () => ({
  getOpenMeteoForecast: vi.fn()
}));

import { getOpenMeteoForecast } from "../src/providers/weather.provider.js";
import { getWeatherForDate } from "../src/services/weather.service.js";

const mockedProvider = vi.mocked(getOpenMeteoForecast);

const sampleForecast = {
  date: "2026-10-16",
  conditionCode: 2,
  minTempC: 11,
  maxTempC: 20,
  precipitationProbabilityPct: 20,
  precipitationMm: 0.2,
  windSpeedMaxKmh: 12,
  windGustsMaxKmh: 24,
  hourly: [
    {
      time: "2026-10-16T09:00",
      temperatureC: 15,
      apparentTemperatureC: 15,
      precipitationProbability: 10,
      precipitationMm: 0,
      conditionCode: 2,
      windSpeedKmh: 8,
      windGustsKmh: 15,
      relativeHumidity: 65,
      cloudCover: 40
    }
  ]
};

describe("RF07 - Weather service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
     // mockedProvider.mockResolvedValue(sampleForecast);
    mockedProvider.mockImplementation(async (date) => ({
        ...sampleForecast,
        date,
        hourly: sampleForecast.hourly.map((hour) => ({
            ...hour,
            time: `${date}T09:00`
        }))
    }));
  });

  it("returns a normalized forecast within 7 days", async () => {
    const result = await getWeatherForDate("2026-10-16", "2026-10-13");

    expect(result.status).toBe("available");

    if (result.status === "available") {
      expect(result.forecast.source).toBe("open-meteo");
      expect(result.forecast.condition).toBe("partly_cloudy");
      expect(result.forecast.hourly).toHaveLength(1);
    }
  });

  it("accepts the seventh day", async () => {
    const result = await getWeatherForDate("2026-10-20", "2026-10-13");
    expect(result.status).toBe("available");
  });

  it("rejects dates beyond the seven-day horizon without calling provider", async () => {
    const result = await getWeatherForDate("2026-10-21", "2026-10-13");

    expect(result.status).toBe("beyond_reliable_horizon");
    expect(mockedProvider).not.toHaveBeenCalled();
  });

  it("rejects dates in the past", async () => {
    const result = await getWeatherForDate("2026-10-12", "2026-10-13");
    expect(result.status).toBe("date_in_past");
  });

  it("rejects impossible calendar dates", async () => {
    const result = await getWeatherForDate("2026-02-30", "2026-10-13");
    expect(result.status).toBe("invalid_date");
  });

  it("reports an unavailable forecast when the provider fails", async () => {
    mockedProvider.mockResolvedValue(null);

    const result = await getWeatherForDate("2026-10-16", "2026-10-13");
    expect(result.status).toBe("forecast_unavailable");
  });
});
