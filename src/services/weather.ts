// src/services/weather.ts
'use server';

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

// This is a mock function. In a real application, you would fetch this data
// from a weather API like OpenWeatherMap.
export async function getWeather(location: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeather API key not found.');
  }

  // First, get coordinates for the location
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) {
    throw new Error(`Failed to fetch coordinates for ${location}`);
  }
  const geoData = await geoResponse.json();
  if (geoData.length === 0) {
    throw new Error(`Could not find location: ${location}`);
  }
  const { lat, lon } = geoData[0];


  // Then, get the weather for those coordinates
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const weatherResponse = await fetch(weatherUrl);
   if (!weatherResponse.ok) {
    throw new Error(`Failed to fetch weather for ${location}`);
  }
  const weatherData = await weatherResponse.json();

  return {
    location: weatherData.name,
    temperature: weatherData.main.temp,
    condition: weatherData.weather[0].main,
    wind_speed: weatherData.wind.speed,
    humidity: weatherData.main.humidity,
    rain_volume: weatherData.rain ? weatherData.rain['1h'] : 0,
  };
}
