import { useEffect, useState } from 'react';
import './App.css';

const WEATHER_CODES = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  61: { label: 'Light rain', emoji: '🌦️' },
  63: { label: 'Rain', emoji: '🌧️' },
  71: { label: 'Light snow', emoji: '🌨️' },
  80: { label: 'Rain showers', emoji: '🌦️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
};
const codeInfo = (c) => WEATHER_CODES[c] ?? { label: 'Unknown', emoji: '🌡️' };
const windDir = (deg) => {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
};

async function fetchWeather(query) {
  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  ).then(r => r.json());
  if (!geo.results?.[0]) throw new Error(`Couldn't find "${query}"`);
  const { latitude, longitude, name, country } = geo.results[0];

  const w = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=5`
  ).then(r => r.json());

  const c = w.current, d = w.daily;
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return {
    city: name,
    country,
    temp: Math.round(c.temperature_2m),
    high: Math.round(d.temperature_2m_max[0]),
    low: Math.round(d.temperature_2m_min[0]),
    description: codeInfo(c.weather_code).label,
    humidity: Math.round(c.relative_humidity_2m),
    wind: Math.round(c.wind_speed_10m),
    windDir: windDir(c.wind_direction_10m),
    feelsLike: Math.round(c.apparent_temperature),
    pressure: Math.round(c.surface_pressure),
    uv: Math.round(d.uv_index_max[0] ?? 0),
    daily: d.time.slice(0, 5).map((iso, i) => ({
      day: dayNames[new Date(iso).getDay()],
      code: d.weather_code[i],
      max: Math.round(d.temperature_2m_max[i]),
      min: Math.round(d.temperature_2m_min[i]),
    })),
  };
}

export default function App() {
  const [query, setQuery] = useState('San Francisco');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (q) => {
    setLoading(true);
    setError('');
    try {
      setData(await fetchWeather(q));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load('San Francisco'); }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const uvLabel = data ? (data.uv <= 2 ? 'Low' : data.uv <= 5 ? 'Moderate' : data.uv <= 7 ? 'High' : 'Extreme') : '';
  const humidityLabel = data ? (data.humidity < 30 ? 'Dry' : data.humidity < 70 ? 'Optimal' : 'Humid') : '';

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Skyline<span className="accent">Precise</span></h1>
          <p className="date">{today}</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) load(query.trim()); }} className="search-form">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search city..." />
        </form>
      </header>

      <main className="main-grid">
        <section className="left-col">
          <div className="hero-card">
            {loading ? (
              <p className="status">Fetching atmospheric data…</p>
            ) : error ? (
              <p className="status error">{error}</p>
            ) : data && (
              <>
                <div className="badge">📍 CURRENT WEATHER</div>
                <div className="hero-row">
                  <div>
                    <h2>{data.city}</h2>
                    <p className="sub">{data.country} · {data.description}</p>
                  </div>
                  <div className="temp-block">
                    <span className="temp">{data.temp}°</span>
                    <div className="hi-lo">
                      <span>H: {data.high}°</span>
                      <span>L: {data.low}°</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {data && !loading && !error && (
            <div className="forecast-row">
              {data.daily.map((d, i) => (
                <div key={i} className={`forecast-card ${i === 0 ? 'active' : ''}`}>
                  <span className="day">{i === 0 ? 'Today' : d.day}</span>
                  <div className="emoji-circle">{codeInfo(d.code).emoji}</div>
                  <span className="fmax">{d.max}°</span>
                  <span className="fmin">{d.min}°</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="right-col">
          <h3>Local Insights</h3>
          <InsightRow icon="💨" label="Wind Speed" value={data ? `${data.wind} km/h` : '—'} aside={data?.windDir} />
          <InsightRow icon="💧" label="Humidity" value={data ? `${data.humidity}%` : '—'} aside={humidityLabel} asideClass="green" />
          <InsightRow icon="☀️" label="UV Index" value={data ? `${data.uv} of 10` : '—'} aside={uvLabel} />
          <InsightRow icon="🌡️" label="Feels Like" value={data ? `${data.feelsLike}°` : '—'} />
          <InsightRow icon="📊" label="Pressure" value={data ? `${data.pressure} hPa` : '—'} />
        </aside>
      </main>
    </div>
  );
}

function InsightRow({ icon, label, value, aside, asideClass }) {
  return (
    <div className="insight-row">
      <div className="insight-left">
        <div className="insight-icon">{icon}</div>
        <div>
          <p className="insight-label">{label}</p>
          <p className="insight-value">{value}</p>
        </div>
      </div>
      {aside && <span className={`insight-aside ${asideClass || ''}`}>{aside}</span>}
    </div>
  );
}
