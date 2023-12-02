import { DateTime } from "luxon";

const API_KEY = "bcdbe0be26c74ba875a6ed6cd0372300";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({...searchParams, appid: API_KEY });

    return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
    } = data;

    const { main: details, icon } = weather[0];

    return {
        lat,
        lon,
        temp,
        feels_like,
        temp_min,
        temp_max,
        humidity,
        name,
        dt,
        country,
        sunrise,
        sunset,
        details,
        icon,
        speed,
    };
};

// const formatForecastWeather = (data) => {
//     let { timezone, daily, hourly } = data;
//     daily = daily.slice(1, 6).map((d) => {
//         return {
//             title: formatToLocalTime(d.dt, timezone, "ccc"),
//             temp: d.temp.day,
//             icon: d.weather[0].icon,
//         };
//     });

//     hourly = hourly.slice(1, 6).map((d) => {
//         return {
//             title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
//             temp: d.temp,
//             icon: d.weather[0].icon,
//         };
//     });

//     return { timezone, daily, hourly };
// };

const formatForecastWeather = (data) => {
    let { timezone, daily, hourly } = data;

    // Check if 'daily' and 'hourly' arrays are defined and have at least one item
    if (daily && daily.length >= 1) {
        daily = daily.slice(1, 6).map((d) => {
            return {
                title: formatToLocalTime(d.dt, timezone, "ccc"),
                temp: d.temp.day,
                icon: d.weather[0].icon,
            };
        });
    } else {
        daily = []; // Set it to an empty array if it's undefined or empty
    }

    if (hourly && hourly.length >= 1) {
        hourly = hourly.slice(1, 6).map((d) => {
            return {
                title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
                temp: d.temp,
                icon: d.weather[0].icon,
            };
        });
    } else {
        hourly = []; // Set it to an empty array if it's undefined or empty
    }

    return { timezone, daily, hourly };
};

const getFormattedWeatherData = async(searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        "weather",
        searchParams
    ).then(formatCurrentWeather);

    const { lat, lon } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData("onecall", {
        lat,
        lon,
        exclude: "current,minutely,alerts",
        units: searchParams.units,
    }).then(formatForecastWeather);

    return {...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
    secs,
    zone,
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
    `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };