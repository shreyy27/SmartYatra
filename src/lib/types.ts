import { z } from 'zod';

export const WeatherDataSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
  wind_speed: z.number(),
  humidity: z.number(),
  rain_volume: z.number().optional(),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;
