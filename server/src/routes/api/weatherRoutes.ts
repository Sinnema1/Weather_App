import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).send('City name is required');
  }

  try {

    await HistoryService.addCity(city);

  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  return res.json({
    message: 'City added to search history',
    weatherData,
  });
} catch (error) {
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
