// [*] Applica le regole di RF07 e normalizza i dati

import type {
  WeatherCondition,
  WeatherForecast,
  WeatherResult
} from "../domain/weather.js";
import { getOpenMeteoForecast } from "../providers/weather.provider.js";

const MAX_FORECAST_DAYS = 7;
const TIME_ZONE = "Europe/Rome";

function getTodayInRome(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const part = (type: string) =>
    parts.find((item) => item.type === type)!.value;

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function isValidDateOnly(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

function daysBetween(start: string, end: string): number {
  const startMs = Date.parse(`${start}T00:00:00.000Z`);
  const endMs = Date.parse(`${end}T00:00:00.000Z`);

  return Math.round((endMs - startMs) / 86_400_000);
}

function normalizeCondition(code: number | null): WeatherCondition {
  if (code === null) return "unknown";
  if (code === 0) return "sunny";
  if ([1, 2].includes(code)) return "partly_cloudy";
  if ([3, 45, 48].includes(code)) return "cloudy";
  if (code >= 71 && code <= 77) return "snow";
  if ([85, 86].includes(code)) return "snow";

  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    [95, 96, 99].includes(code)
  ) {
    return "rain";
  }

  return "unknown";
}

export async function getWeatherForDate(
  date: string,
  today = getTodayInRome()
): Promise<WeatherResult> {
  if (!isValidDateOnly(date)) {
    return {
      status: "invalid_date",
      message: "La data deve essere valida e nel formato YYYY-MM-DD."
    };
  }

  if (date < today) {
    return {
      status: "date_in_past",
      date,
      message: "Non sono disponibili previsioni per date passate."
    };
  }

  if (daysBetween(today, date) > MAX_FORECAST_DAYS) {
    return {
      status: "beyond_reliable_horizon",
      date,
      message:
        "Data oltre l'orizzonte operativo di 7 giorni. " +
        "Il meteo non verrà utilizzato come predittore."
    };
  }

  const raw = await getOpenMeteoForecast(date);

  if (!raw) {
    return {
      status: "forecast_unavailable",
      date,
      message: "Previsione meteo non disponibile per la data richiesta."
    };
  }

  const forecast: WeatherForecast = {
    date: raw.date,
    condition: normalizeCondition(raw.conditionCode),
    temperatureMinC: raw.minTempC,
    temperatureMaxC: raw.maxTempC,
    precipitationProbability: raw.precipitationProbabilityPct,
    precipitationMm: raw.precipitationMm,
    windSpeedMaxKmh: raw.windSpeedMaxKmh,
    windGustsMaxKmh: raw.windGustsMaxKmh,
    source: "open-meteo",
    hourly: raw.hourly.map((hour) => ({
      time: hour.time,
      temperatureC: hour.temperatureC,
      apparentTemperatureC: hour.apparentTemperatureC,
      precipitationProbability: hour.precipitationProbability,
      precipitationMm: hour.precipitationMm,
      condition: normalizeCondition(hour.conditionCode),
      windSpeedKmh: hour.windSpeedKmh,
      windGustsKmh: hour.windGustsKmh,
      relativeHumidity: hour.relativeHumidity,
      cloudCover: hour.cloudCover
    }))
  };

  return { status: "available", forecast };
}