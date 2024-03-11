/************************** * 
* https://github.com/mapshakers/leaflet-icon-pulse
*********************************/
import { useState } from "react";
import { Marker, Popup, Tooltip} from "react-leaflet";
import L from 'leaflet' 
import './leaflet-pulse-icon/L.Icon.Pulse.js'
import './leaflet-pulse-icon/L.Icon.Pulse.css'

export default function Poi({marker, handleMarkerDragEnd,  handleMarkerDragStart, handlePoiClick, index, markerRefs }){ 
    const [ tooltipEnabled, setTooltipEnabled ] = useState(true);  

    const iconDefault = new L.Icon.Default({imagePath: './assets/'}); // imposto il percorso per le icone di default
    let icon =  L.icon({iconUrl: marker.imgURL, iconSize: [35,35], shadowUrl: './assets/marker-shadow.png', shadowAnchor: [-6, 23] })
    
    if ( marker.type === 'location') icon = iconDefault;
    else if ( marker.type === 'alert') icon = L.icon.pulse({iconSize:[20,20],color:'red', heartbeat: 2});

    //const handleMarkerDragStart = (event) => { // gestisci undo della posizione del marker
    //  console.log('old coord', event.target._latlng)
    //}

    return (             
      <Marker            
        icon={ icon }
        position={[marker.lat, marker.lon]}
        draggable={true} 
        eventHandlers={{
                        dragstart: (event) => handleMarkerDragStart(marker._id, event), // gestisci posizione inziale del marker per undo 
                        dragend: (event) => handleMarkerDragEnd(marker._id, event), //gestisce la posizione finale marker
                        click: () => handlePoiClick(index), //gestisce il click sul POI
                        popupopen: () => setTooltipEnabled(false), // disabilita il tooltip con popup aperto
                        popupclose: () => setTooltipEnabled(true)  // abilita il tooltip col popup chiuso
          }} 
        ref={(markerRef) => { // Aggiungi la ref corrente al vettore delle refs dei marker
            markerRefs.current[index] = markerRef;
        }}// ~ ref            
      >
      {/*<ClickComponent setClick={setMouseClick}/>*/}
      <Popup className='text-justify'>{marker.text}</Popup>
      { // verica se il popup è aperto, nel caso disabilita il tooltip 
        tooltipEnabled ? <Tooltip>{marker.text}</Tooltip>: null
      }
    </Marker>      
   )
} 