import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import Footer from './components/Footer';

const App = () => {
  const [driverLocation, setDriverLocation] = useState(null);

  // Function to update driver's location
  const updateDriverLocation = () => {
    // Use browser geolocation API to get current location
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setDriverLocation({ lat: latitude, lng: longitude });
      },
      error => console.error(error)
    );
  };

  // Update driver's location every 10 seconds
  useEffect(() => {
    const interval = setInterval(updateDriverLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <MapContainer driverLocation={driverLocation} />
      <Footer />
    </div>
  );
};

export default App;
