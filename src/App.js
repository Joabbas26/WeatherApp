import {useState} from 'react';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCloud, faCloudRain, faSun, faMoon, faCloudSun, faBoltLightning, faWind, faSnowflake, faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';
import { DateTime } from 'luxon';

export default function App() {

  const [city, setCity] = useState('');
  const [data, setData] = useState({});
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  
    // api key and base url
    const api = {
      timeZone : {
        key: process.env.REACT_TIME_API_KEY,
        base: "https://maps.googleapis.com/maps/api",
      },
  
      weather : {
        key: process.env.REACT_WEATHER_API_KEY,
        base: "https://api.openweathermap.org",
      }
    }
  
    async function fetchData () {
      // Get weather from openweather api
    try {
      await axios.get(`${api.weather.base}/data/2.5/weather?q=${city}&units=imperial&appid=${api.weather.key}`)
        .then((response) => {
          setData(response.data);
          const { lon, lat } = response.data.coord;
  
        // Fetch timezone data using Google Maps Time Zone API
        axios.get(
          `${api.timeZone.base}/timezone/json?location=${lat},${lon}&timestamp=${Math.floor(Date.now() / 1000)}&key=${api.timeZone.key}`)
          .then(timezoneResponse => {
            const { timeZoneId } = timezoneResponse.data;
  
            // Create Luxon DateTime object with correct timezone
            const currentTime = DateTime.now().setZone(timeZoneId);
  
            // Format date and time
            const formattedDate = currentTime.toLocaleString({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            const formattedTime = currentTime.toLocaleString({ hour: 'numeric', minute: '2-digit', hour12: true });
  
            setDate(formattedDate);
            setTime(formattedTime);
        })
            .catch(error => {
              console.log(error);
            })
          })
          } catch (error) {
          console.log(error);
        }
      setCity('');
    }
    
    let description = '';
  
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
  
      const newCondition = [
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
      ];
  
      let hour = data.timezone;
  
      for(let i = 0; i < condition.length; i++){
        if(parseInt(hour) >= 19){
          description = 'Night';
          return <FontAwesomeIcon icon={faMoon} size='10x'/>
        }
        else if(data.weather[0].main === condition[i]){  
          description = newCondition[i];
          return <FontAwesomeIcon icon={iconCondition[i]} size='10x'/>
        }
      }
    }
  
    return (
      <div className='justify-center items-center py-20 bg-gray-800 grow h-screen md:hfull'>
        <div className="flex justify-center mx-10">
          <input type="search" required placeholder="Enter Your City" value={city} onChange={e => setCity(e.target.value)}
            className="text-white border border-gray-300 rounded-lg py-2 px-4 w-64 md:w-80 focus:outline-none"
            onKeyDown={(e) => { if (e.key === "Enter") fetchData(); 
            }}/>
          <button className="right-0 top-0 bottom-0 rounded-lg border border-gray-700 flex items-center justify-center w-12 bg-gray-700 ml-1">
            <FontAwesomeIcon icon={faSearch} onClick={fetchData} className="text-gray-400" />
          </button>
        </div>
        <div className="flex justify-center">
          <div className="w-10/12 bg-blue-400 p-4 rounded-2xl my-6 items-center md:p-20 lg:w-3/5">
            <p className="text-center mb-4 font-bold text-4xl">{data.name}</p>
            <div className="flex flex-col items-center justify-evenly lg:mx-10 md:flex-row">
              <div className="md:w-1/2">
                  <p className='mb-2 text-xxs md:text-lg'>{data.weather ? selectCondition() : null}</p>
                  <div className='flex font-bold justify-center md:justify-start md:ml-10'>{data.weather ? <p>{description}</p> : null}</div>
              </div>
              <div className="font-bold md:w-1/2 md:text-right">{data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}</div>
            </div>
            <div className="p-3 mt-4 lg:ml-10">
              <p className='font-bold text-4xl'>{time}</p>
              <p className='font-bold'>{date}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }