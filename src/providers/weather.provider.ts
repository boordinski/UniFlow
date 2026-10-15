
import { z } from "zod";


// [+] Centrato su Povo 1, Polo Ferrari
const LATITUDE = 46.066902;
const LONGITUDE = 11.150308;

const hourlySchema = z.object({
  time: z.array(z.string()),
  temperature_2m: z.array(z.number().nullable()),
  apparent_temperature: z.array(z.number().nullable()),
  precipitation_probability: z.array(z.number().nullable()),
  precipitation: z.array(z.number().nullable()),
  weather_code: z.array(z.number().nullable()),
  wind_speed_10m: z.array(z.number().nullable()),
  wind_gusts_10m: z.array(z.number().nullable()),
  relative_humidity_2m: z.array(z.number().nullable()),
  cloud_cover: z.array(z.number().nullable())
});

const dailySchema = z.object({
  time: z.array(z.string()),
  weather_code: z.array(z.number().nullable()),
  temperature_2m_min: z.array(z.number().nullable()),
  temperature_2m_max: z.array(z.number().nullable()),
  precipitation_probability_max: z.array(z.number().nullable()),
  precipitation_sum: z.array(z.number().nullable()),
  wind_speed_10m_max: z.array(z.number().nullable()),
  wind_gusts_10m_max: z.array(z.number().nullable())
});

const responseSchema = z.object({
  hourly: hourlySchema,
  daily: dailySchema
});

export interface RawWeatherForecast {
  date: string;
  conditionCode: number | null;
  minTempC: number;
  maxTempC: number;
  precipitationProbabilityPct: number | null;
  precipitationMm: number;
  windSpeedMaxKmh: number;
  windGustsMaxKmh: number;
  hourly: {
    time: string;
    temperatureC: number | null;
    apparentTemperatureC: number | null;
    precipitationProbability: number | null;
    precipitationMm: number | null;
    conditionCode: number | null;
    windSpeedKmh: number | null;
    windGustsKmh: number | null;
    relativeHumidity: number | null;
    cloudCover: number | null;
  }[];
}

export async function getOpenMeteoForecast(
  date: string
): Promise<RawWeatherForecast | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");

  url.search = new URLSearchParams({
    latitude: String(LATITUDE),
    longitude: String(LONGITUDE),
    timezone: "Europe/Rome",
    forecast_days: "8",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
    daily: [
      "weather_code",
      "temperature_2m_min",
      "temperature_2m_max",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_gusts_10m_max"
    ].join(","),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_gusts_10m",
      "relative_humidity_2m",
      "cloud_cover"
    ].join(",")
  }).toString();

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return null;
    }

    const parsed = responseSchema.safeParse(await response.json());

    if (!parsed.success) {
      return null;
    }

    const { daily, hourly } = parsed.data;
    const dayIndex = daily.time.indexOf(date);

    if (dayIndex === -1) {
      return null;
    }

    const minTempC = daily.temperature_2m_min[dayIndex];
    const maxTempC = daily.temperature_2m_max[dayIndex];
    const precipitationMm = daily.precipitation_sum[dayIndex];
    const windSpeedMaxKmh = daily.wind_speed_10m_max[dayIndex];
    const windGustsMaxKmh = daily.wind_gusts_10m_max[dayIndex];

    if (
      minTempC == null ||
      maxTempC == null ||
      precipitationMm == null ||
      windSpeedMaxKmh == null ||
      windGustsMaxKmh == null
    ) {
      return null;
    }

    const hourlyForecast = hourly.time
      .map((time, index) => ({
        time,
        temperatureC: hourly.temperature_2m[index] ?? null,
        apparentTemperatureC:
          hourly.apparent_temperature[index] ?? null,
        precipitationProbability:
          hourly.precipitation_probability[index] ?? null,
        precipitationMm: hourly.precipitation[index] ?? null,
        conditionCode: hourly.weather_code[index] ?? null,
        windSpeedKmh: hourly.wind_speed_10m[index] ?? null,
        windGustsKmh: hourly.wind_gusts_10m[index] ?? null,
        relativeHumidity:
          hourly.relative_humidity_2m[index] ?? null,
        cloudCover: hourly.cloud_cover[index] ?? null
      }))
      .filter((hour) => hour.time.startsWith(`${date}T`));

    return {
      date,
      conditionCode: daily.weather_code[dayIndex] ?? null,
      minTempC,
      maxTempC,
      precipitationProbabilityPct:
        daily.precipitation_probability_max[dayIndex] ?? null,
      precipitationMm,
      windSpeedMaxKmh,
      windGustsMaxKmh,
      hourly: hourlyForecast
    };
  } catch {
    // Timeout, errore di rete o risposta non valida.
    return null;
  }
}
