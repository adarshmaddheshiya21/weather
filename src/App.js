// Import necessary dependencies
import React, { useEffect, useState } from "react";
import "./App.css";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./login" // Import the Login component

function App() {
  const [query, setQuery] = useState({ q: "berlin" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch weather data only if the user is authenticated
    if (user) {
      const fetchWeather = async () => {
        const message = query.q ? query.q : "current location.";

        toast.info("Fetching weather for " + message);

        await getFormattedWeatherData({ ...query, units }).then((data) => {
          toast.success(
            `Successfully fetched weather for ${data.name}, ${data.country}.`
          );

          setWeather(data);
        });
      };

      fetchWeather();
    }
  }, [query, units, user]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
};

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>
      {!user ? ( // Render login page if the user is not authenticated
        <Login onLogin={handleLogin} />
      ) : (
        // Render main content if the user is authenticated
        <>
          <TopButtons setQuery={setQuery} />
          <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

          {weather && (
            <div>
              <TimeAndLocation weather={weather} />
              <TemperatureAndDetails weather={weather} />
              <Forecast title="hourly forecast" items={weather.hourly} />
              <Forecast title="daily forecast" items={weather.daily} />
            </div>
          )}
          <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
        </>
      )}
    </div>
  );
}

export default App;
