import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  description: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    description: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
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
      return locationData as Coordinates[];
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
      currentWeatherData.wind.speed,
      currentWeatherData.main.humidity
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(forecastData: any): Weather[] {
    if (!forecastData.list || !Array.isArray(forecastData.list)) {
      throw new Error('Invalid forecast data');
    }

    const currentDate = new Date().toISOString().split('T')[0];

    return forecastData.list
      .filter((item: any) => item.dt_txt.split(' ')[0] !== currentDate) // Exclude data for the current day
      .map((item: any) => new Weather(
        forecastData.city.name,
        item.dt_txt,
        item.weather[0].icon, // Access the first element of the weather array
        item.weather[0].description, // Access the first element of the weather array
        item.main.temp,
        item.wind.speed,
        item.main.humidity
      ));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(cityName: string): Promise<any> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(cityName);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(weatherData);
      console.log('getWeatherForCity coordinates:', coordinates);
      console.log('getWeatherForCity Weather Data:', weatherData);
      return { currentWeather, forecastArray };
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error getting weather for city');
    }
  }
}

export default new WeatherService();
