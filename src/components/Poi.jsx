import { useState } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';

function Poi({poi}){
    const {statoPoi, setStatoPoi} = useState();

    let a;
    if (poi.type == "exit") a = '/assets/uscita-emergenza.jpg';
    else if (poi.type == "raccolta") a = '/assets/raccolta.jpg';
    else if (poi.type == "alert") a = '/assets/alert.png';
    else a = '/assets/location.png';
    let icona= L.icon({
        iconUrl: a,
        iconSize: [30,30]
    })

    return(
        <Marker  id={poi._id} position={[poi.lat, poi.lon]} icon={icona} draggable="true" onclick={(e) => console.log(e)}>
            <Popup>
            {poi.text}
            </Popup>
            <Tooltip>{poi.text}</Tooltip>
        </Marker>
    )
}

export default Poi;