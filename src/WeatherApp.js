import React, {useState} from 'react';
import './WeatherApp.scss'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloud, faCloudRain, faSun, faMoon, faCloudSun, faBoltLightning, faWind, faSnowflake, faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';

export default function WeatherApp() {

const [city, setCity] = useState('');
const [data, setData] = useState({});

  const getTodaysDate = (d) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
      ];
 
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
 
    var day = days[d.getDay()]; // Fetches the day of the week
    var date = d.getDate(); // Fetches the date i.e. 1st - 31st day of the month
    var month = months[d.getMonth()]; // Fetches the month
    var year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
  }

  var Time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
  // var hour = new Date().getHours();
  var description = '';

 

  // api key and base url
  const api = {
    key: "3fabe9fdca16afb5e55e69008aee39d3",
    base: "https://api.openweathermap.org/data/2.5/"
  }

  // Get weather from api
  async function searchWeather () {
    // Get weather from api
      await axios.get(`${api.base}weather?q=${city}&units=imperial&appid=${api.key}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error))
      setCity('');
  }

  var hour = data.timezone;

  const selectCondition = () => {
    const condition = [
      'Clouds',
      'Fog',
      'Mist',
      'Rain',
      'Heavy Rain',
      'Wind',
      'Partly Cloudy',
      'Sun',
      'Clear',
      'Snow',
      'Thunder',
      'Night'
    ];

    const iconCondition = [
      faCloud,
      faCloud,
      faCloud,
      faCloudRain,
      faCloudShowersHeavy,
      faWind,
      faCloudSun,
      faSun,
      faSun,
      faSnowflake,
      faBoltLightning,
      faMoon
    ];

    const betterCondition = [
      'Cloudy',
      'Fog',
      'Mist',
      'Raining',
      'Heavy Rain',
      'Windy',
      'Partly Cloudy',
      'Sunny',
      'Sunny',
      'Snowing',
      'Lightning',
      'Night'
    ]

    for(var i = 0; i < condition.length; i++){
      console.log(hour);
      if(parseInt(hour) >= 19){
        description = 'Night';
        return <FontAwesomeIcon icon={faMoon} size='10x'/>
      }
      else if(data.weather[0].main === condition[i]){  
        description = betterCondition[i];
        return <FontAwesomeIcon icon={iconCondition[i]} size='10x'/>
      }
    }
  }

  return (
    <div className='weatherApp'>
      <div className='wrap'>
          <div className="searchField"> 
            <input type="search" name="search" required placeholder="Enter Your City" 
            className='searchInput' value={city} onChange={e => setCity(e.target.value)}/>
            <button type="submit" className="searchButton">
            <FontAwesomeIcon icon={faSearch} onClick={searchWeather}/> 
            </button>
          </div>
      </div>
      
      <div className='container' id="weatherContainer">
         <div className="weather">
           <div className="city">
             <p>{data.name}</p>
             </div>
           <div className='row' id='tempInfo'>
            <div className='col-md-8' id="condition">
              {data.weather ? selectCondition() : null}
              {/* {data.weather ? <p>{data.weather[0].main}</p> : null} */}
              {data.weather ? <p>{description}</p> : null}
            </div>
            <div className='col-md-4' id="temperature">
              {data.main ? <p>{data.main.temp.toFixed()}°F</p> : null}
              </div>
           </div>
           <div className='dateAndTime'>
             <div className="time">{Time}</div>
             <div className='date'>{getTodaysDate(new Date())}</div>
           </div>
        </div>
      </div>
    </div>
  )
}

/*


*/