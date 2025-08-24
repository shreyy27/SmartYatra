// src/services/weather.ts
'use server';

import type { WeatherData } from '@/lib/types';

// This is a mock function. In a real application, you would fetch this data
// from a weather API like OpenWeatherMap.
export async function getWeather(location: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('OpenWeather API key not found. Please set OPENWEATHER_API_KEY in .env.local');
    // Return mock data or throw an error if the API key is missing
    return {
      location: location,
      temperature: 25,
      condition: 'Clear',
      wind_speed: 5,
      humidity: 60,
      rain_volume: 0,
    };
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
