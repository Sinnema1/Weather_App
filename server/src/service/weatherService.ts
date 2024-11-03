import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(
    cityName: string,
    date: string,
    icon: string,
    description: string,
    temperature: number,
    humidity: number,
    windSpeed: number
  ) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    try {
      const response = await fetch(this.buildGeocodeQuery(query));
      const locationData = await response.json();
      console.log('Location Data:', locationData);
      return locationData;
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error fetching location data');
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    const data = locationData[0];
    return {
      lat: data.lat,
      lon: data.lon
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    console.log('Coordinates for Weather Query:', coordinates);
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      const weatherData = await response.json();
      console.log('Weather Data:', weatherData);
      return weatherData;
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error fetching weather data');
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    if (!response.city || !response.list || response.list.length === 0) {
      console.error('Invalid weather data:', response);
      throw new Error('Invalid weather data');
    }
  
    const currentWeatherData = response.list[0];
  
    return new Weather(
      response.city.name,
      currentWeatherData.dt_txt,
      currentWeatherData.weather[0].icon,
      currentWeatherData.weather[0].description,
      currentWeatherData.main.temp,
      currentWeatherData.main.humidity,
      currentWeatherData.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(forecastData: any): Weather[] {
    if (!forecastData.list || !Array.isArray(forecastData.list)) {
      throw new Error('Invalid forecast data');
    }

    return forecastData.list.map((item: any) => new Weather(
      forecastData.city.name,
      item.dt_txt,
      item.weather.icon,
      item.weather.description,
      item.main.temp,
      item.main.humidity,
      item.wind.speed
    ));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<any> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const currentWeatherData = await this.fetchWeatherData(coordinates);
      const forecastData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(currentWeatherData);
      const forecastArray = this.buildForecastArray(forecastData);
      return { currentWeather, forecastArray };
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error getting weather for city');
    }
  }
}

export default new WeatherService();
