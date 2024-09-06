import axios from 'axios';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

export const getWeatherData = (city: string) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: {
      q: city,
      appid: API_KEY,
    },
  });
};
