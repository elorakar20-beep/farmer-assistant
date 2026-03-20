/**
 * Mock Weather API response
 */
export interface WeatherData {
  rain_expected: boolean;
  humidity: string;
  temperature: string;
}

/**
 * Mock Soil API response
 */
export interface SoilData {
  moisture: string;
  ph: number;
}

/**
 * Retrieves mock weather data.
 * @param {string} [_location] - The location to check for weather
 * @returns {WeatherData} Mock weather context
 */
export async function getMockWeather(location?: { lat: number, lng: number }): Promise<WeatherData> {
  if (location) {
    try {
      // Live anonymous request to open open-meteo API (no secrets needed)
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current_weather=true&hourly=relative_humidity_2m`);
      const data = await res.json();
      
      return {
        rain_expected: data.current_weather?.weathercode > 50, // rough heuristic
        humidity: `${data.hourly?.relative_humidity_2m?.[0] || '60'}%`,
        temperature: `${data.current_weather?.temperature || 25}°C`
      };
    } catch (e) {
      console.error("Failed to fetch weather, falling back to mock", e);
    }
  }

  // Simulating an upcoming rain event as fallback
  return {
    rain_expected: true,
    humidity: '85%',
    temperature: '26°C',
  };
}

/**
 * Retrieves mock soil conditions.
 * @param {string} [_location] - The location to check for soil condition
 * @returns {SoilData} Mock soil context
 */
export function getMockSoil(): SoilData {
  return {
    moisture: 'Low',
    ph: 6.5,
  };
}
