import { useMap, useMapEvent } from 'react-leaflet/hooks';

export default function NewMarker({setMarkers, markers, setNewPOI, newPOI}){  // inserisce nuovo marker col tasto dx del mouse
  const map = useMapEvent({
    contextmenu(e){
      const i = { // lo aggiunge alla lista di marker
        _id:  Date.now().toString().padStart(24,'0'), // per renderlo digeribile a mongoose
        id_text: "text-new",
        id_img: "new",
        type: "location",
        text: "....",
        imgURL: '/assets/location.png',
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        remove: true,
        changed: true
      }
      let index = markers.findIndex(item => item.type == 'path') // trovo il primo elemento path
      //console.log("****", index)
      markers.splice(index, 0, i) // e aggiungo il nuovo poi davanri al primo path
      setMarkers(markers)
      //setMarkers([...markers, i]); // ~ setMarkers
      setNewPOI([...newPOI, i]);
    } // ~ contexmenu
  })  // ~ useMapEvent
  return null;
} // ~ f