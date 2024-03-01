/************************** * 
* https://github.com/mapshakers/leaflet-icon-pulse
*********************************/

import { Marker, Popup} from "react-leaflet";
import L from 'leaflet' 
import './leaflet-pulse-icon/L.Icon.Pulse.js'
import './leaflet-pulse-icon/L.Icon.Pulse.css'

export default function Poi({marker, handleMarkerDragEnd, handlePoiClick, index, markerRefs }){ 
    const iconDefault = new L.Icon.Default();
    let icon =  L.icon({iconUrl: marker.imgURL, iconSize: [35,35] })
    
    if ( marker.type === 'location') icon = iconDefault;
    else if ( marker.type === 'alert') icon = L.icon.pulse({iconSize:[20,20],color:'red', heartbeat: 2});

    return (             
          <Marker            
            icon={ icon }
            position={[marker.lat, marker.lon]}
            draggable={true} 
            eventHandlers={{ dragend: (event) => handleMarkerDragEnd(marker._id, event), //gestisce lo spostamento del marker
                            click: (event) => handlePoiClick(index), //gestisce il click sul POI
              }} 
            ref={(markerRef) => {
                  // Aggiungi la ref corrente al vettore delle refs dei marker
                    markerRefs.current[index] = markerRef;
              }}// ~ ref            
          >
          <Popup className='text-justify'>{marker.text}</Popup>
          </Marker>      
   )
} 