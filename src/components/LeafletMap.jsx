// LeafletMap.js
import React from 'react';
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Poi from './Poi'
import Elenco from './Elenco';
//import { useMap } from 'react-leaflet/hooks'

function MyComponent() {
  const map = useMapEvent('click', () => {
      map.setView([40.462654, 17.250845],17)
    })
    return null
}

function LeafletMap( {poi} ){  

  const position = [40.505, 17.5]; // Latitudine e longitudine iniziali
 
  return (
    <>
    <MapContainer center={position} zoom={13} style={{ height: '600px', width: '100%', border: 'solid 2px black', display: 'sticky' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />    
      {poi.map((item, index) => (
        <Poi key={item._id} poi={item} />
      ))}
      <MyComponent />
    </MapContainer>
    <Elenco poi= {poi} />
    </>
  );
}

export default LeafletMap;
