import { getMockWeather, getMockSoil } from '@/lib/mockServices';

describe('Mock Services', () => {
  it('should return deterministic weather data', () => {
    const weather = getMockWeather();
    expect(weather.rain_expected).toBe(true);
    expect(weather.humidity).toBe('85%');
  });

  it('should return deterministic soil data', () => {
    const soil = getMockSoil();
    expect(soil.moisture).toBe('Low');
    expect(soil.ph).toBe(6.5);
  });
});
