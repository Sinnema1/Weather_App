import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).send('City name is required');
  }

  try {
    await HistoryService.addCity(cityName);

    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history
    return res.json({
      message: 'City added to search history',
      currentWeather: weatherData.currentWeather,
      forecastArray: weatherData.forecastArray
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getHistory();
    return res.json(searchHistory);
  } catch (error) {
    return res.status(500).send('Error reading search history');
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.json({ message: 'City deleted from search history' });
  } catch (error) {
    return res.status(500).send('Error deleting city from search history');
  }
});

export default router;
