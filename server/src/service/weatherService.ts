import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  long: string;
}

// TODO: Define a class for the Weather object
class Weather {
  name: string;
  id: string;
  dateTime: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  weather: string;
  description: string;
  icon: string;
  clouds: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  pop: number;
  rain: number;

  constructor(
    name: string,
    id: string,
    dateTime: string,
    temperature: number,
    feelsLike: number,
    tempMin: number,
    tempMax: number,
    pressure: number,
    humidity: number,
    weather: string,
    description: string,
    icon: string,
    clouds: number,
    windSpeed: number,
    windDeg: number,
    visibility: number,
    pop: number,
    rain: number
  ) {
    this.name = name;
    this.id = id;
    this.dateTime = dateTime;
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.tempMin = tempMin;
    this.tempMax = tempMax;
    this.pressure = pressure;
    this.humidity = humidity;
    this.weather = weather;
    this.description = description;
    this.icon = icon;
    this.clouds = clouds;
    this.windSpeed = windSpeed;
    this.windDeg = windDeg;
    this.visibility = visibility;
    this.pop = pop;
    this.rain = rain;
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
      return locationData;
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error fetching location data');
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    const { lat, long } = locationData[0];
    return { lat, long: long };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.long}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<{ city: any, list: any[] }> {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      return await response.json();
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error fetching weather data');
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { name, id } = response.city;
    const currentWeatherData = response.list[0];
    return new Weather(
      name,
      id,
      'Current',
      currentWeatherData.main.temp,
      currentWeatherData.main.feels_like,
      currentWeatherData.main.temp_min,
      currentWeatherData.main.temp_max,
      currentWeatherData.main.pressure,
      currentWeatherData.main.humidity,
      currentWeatherData.weather[0].main,
      currentWeatherData.weather[0].description,
      currentWeatherData.weather[0].icon,
      currentWeatherData.clouds.all,
      currentWeatherData.wind.speed,
      currentWeatherData.wind.deg,
      currentWeatherData.visibility,
      currentWeatherData.pop,
      currentWeatherData.rain ? currentWeatherData.rain['3h'] : 0
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: { city: any, list: any[] }) {
    const forecastArray = weatherData.list.map((item: any) => new Weather(
      weatherData.city.name,
      weatherData.city.id,
      item.dt_txt,
      item.main.temp,
      item.main.feels_like,
      item.main.temp_min,
      item.main.temp_max,
      item.main.pressure,
      item.main.humidity,
      item.weather[0].main,
      item.weather[0].description,
      item.weather[0].icon,
      item.clouds.all,
      item.wind.speed,
      item.wind.deg,
      item.visibility,
      item.pop,
      item.rain ? item.rain['3h'] : 0
    ));

    // Include current weather in the forecast array
    forecastArray.unshift(currentWeather);

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city: string): Promise<any> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData);
      return { currentWeather, forecastArray };
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Error getting weather for city');
    }
  }
}

export default new WeatherService();
