import { useEffect, useRef , useState } from 'react';

import './Weather.css';

import Search from '@mui/icons-material/Search';
import WbSunny from '@mui/icons-material/WbSunny';
import Air from '@mui/icons-material/Air';
import Grain from '@mui/icons-material/Grain';
import AcUnit from '@mui/icons-material/AcUnit'; 
import Cloud from '@mui/icons-material/Cloud';


const Weather = () => {
  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(null);

  const allIcons = {
    "01": <WbSunny />, // Clear
    "02": <Cloud />,   // Few Clouds & Scattered Clouds
    "03": <Cloud />,   // Few Clouds & Scattered Clouds
    "04": <Cloud />,   // Overcast Clouds
    "09": <Grain />,   // Drizzle & Rain
    "10": <Grain />,   // Drizzle & Rain
    "13": <AcUnit />   // Snow
  }

  const search = async (city) =>{
    if (city === "") {
      alert("Enter city name!");
      return;
    }
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok) {
        alert(data.message);
        return;
      }
      console.log(data);

      const weatherIconCode = data.weather[0].icon.slice(0, 2);
      const icon = allIcons[weatherIconCode] || null;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      });
    }

    catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data", error);
    }
  }

  useEffect(() =>{
    search("Vancouver");
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value);
    }
  }

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="search" onKeyDown={handleKeyDown}/>
        <Search className="custom-search-icon" onClick={()=> search(inputRef.current.value)} />
      </div>

      {weatherData? <> 

        <div className="weather-icon">
        {weatherData.icon}
      </div>

      <p className='temperature'>{weatherData.temperature}°C</p>
      <p className='location'>{weatherData.location}</p>

      <div className="weather-data">
        <div className="col">
          <Grain className="weather-data-icon" />
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <Air className="weather-data-icon" />
          <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>

      </div>           
    </> : <> </>}
    </div>    
      
  );
}

export default Weather;