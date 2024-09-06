import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../src/App.css";


interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
}

const API_KEY = 'b18a240f6b672c914d65eb9ea26c9ebb'; // Replace with your actual API key

const WeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('');

  useEffect(() => {
    getFromSessionStorage();
  }, []);

  const getFromSessionStorage = () => {
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
      // If no coordinates are found, show grant access UI or handle accordingly
      console.log('No coordinates in session storage');
    } else {
      const coordinates = JSON.parse(localCoordinates);
      fetchUserWeatherInfo(coordinates);
    }
  };

  const fetchUserWeatherInfo = async (coordinates: { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`);
      setWeatherData(response.data);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchWeatherInfo = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      setWeatherData(response.data);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchSearchWeatherInfo(city);
    }
  };

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const showPosition = (position: GeolocationPosition) => {
    const userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
  };

  const showError = (error: GeolocationPositionError) => {
    setError('Unable to retrieve your location.');
  };

  return (
    <center>
    <div>
      <h1 className='weather-header'>Weather Forecast</h1>
      <div className="tabs">
        <button onClick={() => handleLocationAccess()}>Use My Location</button>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {weatherData && (
        <div className="weather-info">
          <h1>{weatherData.name}</h1>
          <img
            src={`https://flagcdn.com/144x108/${weatherData.sys.country.toLowerCase()}.png`}
            alt="Country Flag"
          />
          <p>{weatherData.weather[0].description}</p>
          
          <p>{weatherData.main.temp} °C</p>
          <p>{weatherData.wind.speed} m/s</p>
          <p>{weatherData.main.humidity}%</p>
          <p>{weatherData.clouds.all}%</p>
        </div>
      )}
    </div>
    </center>
  );
};

export default WeatherPage;
