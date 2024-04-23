import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import myMarker from '../assets/myMarker.gif';

const MapContainer = () => {
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null);
  const map = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;


  const stops = [
    { lat: -1.939826787816454, lng: 30.0445426438232, name: 'Nyabugogo' },
    { lat: -1.9355377074007851, lng: 30.060163829002217, name: 'Stop A' },
    { lat: -1.9358808342336546, lng: 30.08024820994666, name: 'Stop B' },
    { lat: -1.9489196023037583, lng: 30.092607828989397, name: 'Stop C' },
    { lat: -1.9592132952818164, lng: 30.106684061788073, name: 'Stop D' },
    { lat: -1.9487480402200394, lng: 30.126596781356923, name: 'Stop E' },
    { lat: -1.9365670876910166, lng: 30.13020167024439, name: 'Kimironko' },
  ];


  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentStopIndex, setCurrentStopIndex] = useState(stops.findIndex(stop => stop.name === 'Nyabugogo'));
  const [selectedStop, setSelectedStop] = useState(null);


  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('Device moved to:', currentPosition);
  
        const nextStopPosition = stops[currentStopIndex]; 
  
        // Calculate the distance between currentPosition and nextStopPosition
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(currentPosition),
          new google.maps.LatLng(nextStopPosition)
        );
        setDistance(distance / 1000); // Convert distance to km
  
        // Calculate the time to the next stop
        const time = distance / 50; 
        setTime(time * 60); // Convert time to minutes
  
        console.log('Next stop:', nextStopPosition.name, 'Distance:', distance, 'Time:', time);
  
        // If the distance to the next stop is less than 50 meters, move to the next stop
        if (distance < 50) {
          setCurrentStopIndex((currentStopIndex + 1) % stops.length);
        }
      });
  
      // Clean up the geolocation watch when the component unmounts
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  }, [currentStopIndex]);

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

  return (
    <div>
      <div className='text-gray-100 bg-gradient-to-r from-green-500 to-blue-500 flex flex-col items-center'>
        <div className=''>
          <h1 className='text-2xl font-bold '>NYABUGOGO - KIMIRONKO</h1>
        </div>

        <div className='flex'>
          <h1 className='flex font-bold'>Next stop :</h1> 
          <h4>{stops[currentStopIndex].name}</h4>
        </div>
<div className='flex'>
  <h1 className='flex font-bold'>Distance :</h1> 
  <h4>{distance === 0 ? "Calculating..." : `  ${distance.toFixed(2)} km`}</h4>
</div>
<div className='flex'>
  <h1 className='flex font-bold'>Time :</h1> 
  <h4>{time === 0 ? "Calculating..." : `  ${time.toFixed(2)} minutes`}</h4>
</div>
      </div>
      <LoadScript googleMapsApiKey={apiKey}
         onLoad={() => setScriptLoaded(true)}
      >

{scriptLoaded && (
        <GoogleMap
          mapContainerStyle={{ height: "75vh", width: "100%" }} className="sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] 2xl:h-[90vh]"
          center={stops[0]}
          zoom={15}
          options={{
            streetViewControl: true,
            mapTypeControl: true,
            scaleControl: true,
            rotateControl: true,
            fullscreenControl: true,
            disableDefaultUI: false,
          }}
          onLoad={(mapInstance) => {
            map.current = mapInstance;
            directionsRenderer.current = new window.google.maps.DirectionsRenderer();
            directionsService.current = new window.google.maps.DirectionsService();
            directionsRenderer.current.setMap(mapInstance);

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                mapInstance.setCenter(pos);
              });
            }
          }}
        >
{stops.map((stop, index) => (
  <Marker 
    key={index} 
    position={{ lat: stop.lat, lng: stop.lng }} // Use the actual coordinates
    icon={index === 0 ? undefined : {
      url: myMarker, 
      scaledSize: new window.google.maps.Size(40, 40), // Make the icon smaller
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
