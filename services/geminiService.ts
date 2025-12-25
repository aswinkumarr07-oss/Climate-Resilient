import { GoogleGenAI, Type } from "@google/genai";
import { CityData } from "../types";
import { WeatherData } from "./weatherService";

export async function predictResilience(
  city: CityData, 
  simParams: { rainfall: number, tempRise: number },
  realWeather?: WeatherData | null
) {
  const weatherContext = realWeather 
    ? `REAL-TIME DATA: Current Temp: ${realWeather.temp}°C, Humidity: ${realWeather.humidity}%, Wind: ${realWeather.windSpeed}m/s, Condition: ${realWeather.description}.`
    : `HISTORICAL DATA ONLY: Temp: ${city.temp}°C, Rainfall: ${city.rainfall}mm.`;

  const prompt = `Act as a senior climate disaster management officer. 
  Analyze climate resilience for ${city.name}, ${city.state}, India. 
  ${weatherContext}
  SIMULATION PARAMETERS: Additional Rainfall: ${simParams.rainfall}mm, Heat Rise: ${simParams.tempRise}°C.
  
  Predict flood probability, heatwave risk, and provide a 3-point specific action plan for city administrators. 
  Assign a confidence score (0-100) to your prediction based on the data quality provided.
  Consider current Indian monsoon patterns and local geography.`;

  try {
    // Instantiate a new GoogleGenAI client right before making the API call as per best practices.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            floodProbability: { type: Type.NUMBER, description: "Percentage 0-100" },
            heatwaveRisk: { type: Type.NUMBER, description: "Percentage 0-100" },
            resilienceScore: { type: Type.NUMBER, description: "Score out of 100" },
            confidenceScore: { type: Type.NUMBER, description: "AI confidence in this prediction 0-100" },
            actionPlan: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Top 3 priority actions"
            },
            narrative: { type: Type.STRING, description: "Short summary of the threat level" }
          },
          required: ["floodProbability", "heatwaveRisk", "resilienceScore", "confidenceScore", "actionPlan", "narrative"]
        }
      }
    });

    // Extract text and trim it before parsing JSON to ensure robust handling.
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return null;
  }
}