import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  useEffect(() => {
    // Creazione della mappa Leaflet
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Aggiunta di un layer di mappa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  }, []);

  return (
    <div id="map" style={{ height: '400px' }}></div>
  );
};

export default Map;