import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import myMarker from '../assets/myMarker.gif';

const MapContainer = () => {
  const map = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(null); // Initialize to null to display infinity symbol
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isMoving, setIsMoving] = useState(false); // Track device movement
  const [route, setRoute] = useState(null); // State to hold route data
  const [showRoute, setShowRoute] = useState(true); // State to toggle DirectionsRenderer

  const stops = [
    { lat: -1.939826787816454, lng: 30.0445426438232, name: 'Nyabugogo' },
    { lat: -1.9355377074007851, lng: 30.060163829002217, name: 'Stop A' },
    { lat: -1.9358808342336546, lng: 30.08024820994666, name: 'Stop B' },
    { lat: -1.9489196023037583, lng: 30.092607828989397, name: 'Stop C' },
    { lat: -1.9592132952818164, lng: 30.106684061788073, name: 'Stop D' },
    { lat: -1.9487480402200394, lng: 30.126596781356923, name: 'Stop E' },
    { lat: -1.9365670876910166, lng: 30.13020167024439, name: 'Kimironko' },
  ];

  const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const calculateTime = (distance) => {
     // Display infinity symbol when not moving
    const speed = 60; // km/h
    const hours = Math.floor(distance / speed);
    const minutes = Math.floor((distance % speed) * 60 / speed);
    const seconds = Math.floor(((distance % speed) * 3600 / speed) % 60);
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.current.panTo(currentPosition);
      });
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const nextStopPosition = stops[currentStopIndex];

          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(currentPosition),
            new google.maps.LatLng(nextStopPosition)
          );
          setDistance(distance / 1000);

          if (distance < 50) {
            setCurrentStopIndex((currentStopIndex + 1) % stops.length);
          }

          setIsMoving(distance >= 0.05); // Set isMoving based on distance threshold (50 meters)
          setTime(calculateTime(distance / 1000));
        }, null, { maximumAge: 500, timeout: 500, enableHighAccuracy: true });
      }, 3000); // Run every 3 seconds

      return () => clearInterval(intervalId);
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  }, [currentStopIndex, stops]);

  useEffect(() => {
    if (scriptLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: stops[0],
          destination: stops[stops.length - 1],
          waypoints: stops.slice(1, -1).map(stop => ({ location: stop })),
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            setRoute(result);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [scriptLoaded]);

  return (
    <div>
      <div className='text-gray-100 bg-gradient-to-r from-green-500 to-blue-500 flex flex-col items-center'>
        <div>
          <h1 className='text-2xl font-bold'>NYABUGOGO - KIMIRONKO</h1>
        </div>
        <div className='flex'>
          <h1 className='font-bold'>Next stop :</h1>
          <h4>{stops[currentStopIndex].name}</h4>
        </div>
        <div className='flex'>
          <h1 className='font-bold'>Distance :</h1>
          <h4>{distance === 0 ? "Calculating..." : `${distance.toFixed(2)} km`}</h4>
        </div>
        <div className='flex'>
          <h1 className='font-bold'>Time :</h1>
          <h4>{time === null ? "Calculating..." : `${time}`}</h4>
        </div>
  
      </div>
      <LoadScript googleMapsApiKey={apiKey} onLoad={() => setScriptLoaded(true)}>
        {scriptLoaded && (
          <GoogleMap
            mapContainerStyle={{ height: "75vh", width: "100%" }}
            center={stops[0]}
            zoom={15}
            options={{
              gestureHandling: 'greedy',
              rotateControl: true,
              fullscreenControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              scaleControl: true,
              clickableIcons: false,
              mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT,
              },
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
              fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              rotateControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              compassOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
            }}
            onLoad={(mapInstance) => {
              map.current = mapInstance;
              handleGeolocation();
            }}
          >
            {showRoute && route && <DirectionsRenderer directions={route} />}
            {stops.map((stop, index) => (
              <Marker
                key={index}
                position={{ lat: stop.lat, lng: stop.lng }}
                icon={index === 0 ? undefined : {
                  url: myMarker,
                  scaledSize: new window.google.maps.Size(35, 35),
                }}
                onClick={() => setSelectedStop(stop)}
              >
                {selectedStop === stop && (
                  <InfoWindow onCloseClick={() => setSelectedStop(null)}>
                    <div>{stop.name}</div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default MapContainer;
