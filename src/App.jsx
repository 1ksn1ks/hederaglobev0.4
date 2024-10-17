// App.jsx

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { addPolygonLayer } from './spt/polygons'; // Import the function
import { addMarker } from './spt/markers';

const INITIAL_CENTER = [-63, -65];
const INITIAL_ZOOM = 7;

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiMWtzbjFrcyIsImEiOiJjbTF3MDNmOHowaWU2MmpzN21mbnh0ZDk5In0.UIvnkHf4WouanqXhm5e8cQ';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom
    });

    // Set up listeners to update the center and zoom state
    mapRef.current.on('move', () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    // Call the function to add the polygon layer
    addPolygonLayer(mapRef); // Add the polygon layer

    addMarker(mapRef);

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // Clean up on component unmount
    return () => {
      mapRef.current.remove();
    };
  }, []);

  // Reset map center and zoom when button is clicked
  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });
  };

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button className='reset-button' onClick={handleButtonClick}>
        Reset
      </button>
      <div id='map-container' ref={mapContainerRef} style={{ height: '100vh' }} />
    </>
  );
}

export default App;
