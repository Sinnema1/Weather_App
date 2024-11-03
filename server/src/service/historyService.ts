import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name =name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
    this.ensureFileExists();
  }

  // Ensure the searchHistory.json file exists
  private async ensureFileExists() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      await fs.writeFile(this.filePath, JSON.stringify([]));
    }
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  async getHistory(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      throw new Error('Error reading search history');
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async updateCity(cities: City[]) {
    return await fs.writeFile(this.filePath, JSON.stringify(cities, null, '\t'));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.getHistory();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('city cannot be blank');
    }

    const newCity: City = { name: city, id: uuidv4() };

    return await this.getCities()
    .then((cities) => {
      if (cities.find((index) => index.name === city)) {
        return cities;
      }
      return [...cities, newCity];
    })
    .then((updatedCities) => this.updateCity(updatedCities))
    .then (() => newCity);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.updateCity(updatedCities);
  }
}

export default new HistoryService();

