// [!] Definisce il formato dei dati che Uniflow si aspetta

export type WeatherCondition =
  | "sunny"
  | "partly_cloudy"
  | "cloudy"
  | "rain"
  | "snow"
  | "windy"
  | "hailstorm"
  | "unknown";

export interface WeatherHour {
  time: string;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  precipitationProbability: number | null;
  precipitationMm: number | null;
  condition: WeatherCondition;
  windSpeedKmh: number | null;
  windGustsKmh: number | null;
  relativeHumidity: number | null;
  cloudCover: number | null;
}

export interface WeatherForecast {
  date: string;
  condition: WeatherCondition;
  temperatureMinC: number;
  temperatureMaxC: number;
  precipitationProbability: number | null;
  precipitationMm: number;
  windSpeedMaxKmh: number;
  windGustsMaxKmh: number;
  source: "simulated" | "open-meteo";
  hourly: WeatherHour[];
}

export type WeatherResult =
  | { status: "available"; forecast: WeatherForecast; }
  | {
      status: "beyond_reliable_horizon";
      date: string;
      message: string;
    }
  | {
      status: "date_in_past";
      date: string;
      message: string;
    }
  | {
      status: "invalid_date";
      message: string;
    }
  | {
      status: "forecast_unavailable";
      date: string;
      message: string;
    };
