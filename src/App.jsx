import { useState } from 'react';
import './App.css';

const API_KEY = '0e4ba234d447e69d4c590416f12480fc';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') getWeather();
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p className="temp">{Math.round(weather.main.temp)}°C</p>
          <p className="description">{weather.weather[0].description}</p>
          <div className="details">
            <div>
              <span>Feels like</span>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </div>
            <div>
              <span>Humidity</span>
              <strong>{weather.main.humidity}%</strong>
            </div>
            <div>
              <span>Wind</span>
              <strong>{weather.wind.speed} m/s</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;