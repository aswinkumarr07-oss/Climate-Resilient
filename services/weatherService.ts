
import { INDIAN_CITIES } from "../constants";
import { CityData } from "../types";

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  rain: number;
}

/**
 * OpenWeatherMap API Configuration.
 */
const API_KEY: string = '8e718873094c9a3a936a2692299a9b9b'; 

/**
 * Fetches current weather data for a specific city.
 * Includes a retry mechanism and staggered fallback to handle network or API issues gracefully.
 */
export async function fetchCityWeather(cityName: string, retries = 2): Promise<WeatherData | null> {
  if (!API_KEY || API_KEY === '') {
    console.error("Critical: OpenWeatherMap API Key is not configured.");
    return getFallbackWeatherData(cityName);
  }

  try {
    const query = `${encodeURIComponent(cityName)},IN`;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`,
      { signal: AbortSignal.timeout(8000) } // 8s timeout for robustness
    );
    
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        console.warn(`Rate limit (429) hit for ${cityName}. Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchCityWeather(cityName, retries - 1);
      }
      
      console.warn(`Weather API HTTP Error (${response.status}): ${response.statusText}. Using fallback for ${cityName}.`);
      return getFallbackWeatherData(cityName);
    }
    
    const data = await response.json();
    
    if (!data.main || !data.weather || data.weather.length === 0) {
      throw new Error('Incomplete weather data structure received');
    }

    // Extract rain if available (OpenWeatherMap provides rain in 1h or 3h intervals)
    const rain = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;

    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      rain: rain
    };
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      console.error(`Weather fetch timeout for ${cityName}. Falling back.`);
    } else {
      console.error(`Resilient fallback triggered due to weather fetch error for ${cityName}:`, error.message);
    }
    
    if (retries > 0 && error.name !== 'TimeoutError') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchCityWeather(cityName, retries - 1);
    }

    return getFallbackWeatherData(cityName);
  }
}

/**
 * Centralized function to fetch weather for all cities.
 * Staggers requests to avoid hitting rate limits on free-tier keys.
 */
export async function fetchAllCitiesWeather(cities: CityData[]): Promise<Record<string, WeatherData>> {
  const weatherMap: Record<string, WeatherData> = {};
  
  for (const city of cities) {
    const data = await fetchCityWeather(city.name);
    if (data) {
      weatherMap[city.id] = data;
    }
    // Staggering requests slightly
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return weatherMap;
}

/**
 * Provides realistic mock data if the external API is unavailable.
 */
function getFallbackWeatherData(cityName: string): WeatherData {
  const cityInfo = INDIAN_CITIES.find(c => c.name === cityName);
  
  const variance = (Math.random() * 4) - 2; 
  const baseTemp = cityInfo?.temp || 30;
  const baseHumidity = cityInfo?.humidity || 55;
  const baseRain = cityInfo?.rainfall || 0;

  return {
    temp: Number((baseTemp + variance).toFixed(1)),
    humidity: Math.min(100, Math.max(10, Math.round(baseHumidity + (Math.random() * 10 - 5)))),
    windSpeed: Number((4 + Math.random() * 8).toFixed(1)),
    description: "Simulated Live Data (Fallback)",
    icon: baseTemp > 35 ? "01d" : "03d",
    main: baseTemp > 35 ? "Clear" : "Clouds",
    rain: baseRain
  };
}
