/*********************************
 *  l'inserimento di un nuovo POI
 *  viene gestito dal componente
 *  NewMarker ed è col tasto dx 
 *  https://rubenspgcavalcante.github.io/leaflet-ant-path/
 *  https://gitlab.com/manuel.richter95/leaflet.notifications
 ********************************/

//import { Renderer, marker } from 'leaflet';
import React, { useState, useRef } from 'react';
import { TileLayer, MapContainer, Marker, Popup } from 'react-leaflet';
//import { useMap, useMapEvent } from 'react-leaflet/hooks';
import AntPath from './AntPath';
import NewMarker from './NewMarker';
import 'leaflet/dist/leaflet.css';

let Test = ({markers, setMarkers, setNuoviPoi, setPoiDaCancellare}) => {
  //const [markers, setMarkers] = useState(poi); 
  const [newPOI, setNewPOI] = useState([]);  // contiene i nuovi poi 
  const [oldPOI, setOldPOI] = useState(markers); // contiene i poi di origine che sono rimasti
  //const [deletedOldPOI, setDeletedOldPOI] = useState([{"i": 0}]) // lista dei vecchio POI cancellati
  //const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const markerRefs = useRef([]); // la lista di tutti gli elementi <Marker>
  const mapRef = useRef(); // riferimento alla mappa
  const inputRefs= useRef([]) // lista si tutti i tetxt <input> 

  console.log('------------------------------------------------') 
  console.log('oldPOI',oldPOI)
  console.log('newPOI', newPOI)
  console.log('markers', markers)
  

  const handlePoiClick = (x) => { // evidenzia l'input-text del marker selezionato
    //console.log('in handlePoiClick', inputRefs.current)    
    inputRefs['current'].map((item, index) => { 
      if(item != null){ // fatto così perchè non aggiorna inputRefs
        if (index == x) {
          item.focus();
          item.setAttribute("style","background-color: lightgray") // evidenzia l'input-text del marker selezionato
        } else item.setAttribute("style","background-color: #fff") // ripristina tutti gli altri
      }
    });
  } 

  const handleSavePOI = (markerId, e, i) =>{ // gestisce il pulsate 'save poi'
    //if (newPOI.length > 0) {
      console.log('aggiorno o inserisco POI', markers[i])      
      setOldPOI([...oldPOI, markers[i]]) //aggiorno la lista dei vecchi poi
      const a = newPOI.filter((item) => item._id != markerId) // tolgo dalla lista locale il poi salvato
      setNewPOI(a)// aggiorno la lista locale dei newpoi      
      //markers[i].changed = false; // lo sposto in app.jsx
      setNuoviPoi(markers[i])
    /*} else {
      alert('nessun nuovo poi')
    }*/
  }

  const handleMarkerDragEnd = (markerId, event) => {    // dragged event
    const updatedMarkers = markers.map((marker) =>
      marker._id === markerId
        ? { ...marker, lat: event.target._latlng.lat, lon: event.target._latlng.lng, changed: true }
        : marker
    );
    setMarkers(updatedMarkers);   
  };

  const handlePopupChange = (markerId, e, i) => { //per modificare il contenuto del popup
    console.log('event: ',e.type)
    const value = e.target.value; // recupera cio' che è digitato nell'input-text
    //const isChange = e.type == 'change' ? true : markers[i].changed; // verifica se c'è una modifica nel testo
    handlePoiClick(i); // evidenzia l'input-text del marker selezionato
    markerRefs.current[i].openPopup(); // attiva il popup sull'elemento individuato
    const {lat, lng} = markerRefs.current[i]._latlng; //prendi le coordinate del popup attivo 
    mapRef.current.flyTo([lat,lng], 18); // punta la mappa sul poi selezionato
    markerRefs.current[i].openPopup(); // attiva il popup sull'elemento individuato
    //mapRef.current.setZoom(20)
    if (e.type != 'change') return;
    const updatedMarkers = markers.map((marker) =>
    marker._id === markerId
      ? { ...marker, text: value, id_img: value, id_text: 'text-'+ value, changed: true  }
      : marker
    ); // ~ map  
    setMarkers(updatedMarkers);
  } // ~ f
  
  const handleSelectChange = (markerId, e, index) => { // per modificare l'immagine dell'icona
    markerRefs.current[index].openPopup(); // attiva il popup sull'elemento individuato
    if (e.type == 'click') { // se è solo click
        const {lat, lng} = markerRefs.current[index]._latlng; //prendi le coordinate del poi attivo 
        mapRef.current.flyTo([lat,lng], 18) // punta la mappa sul poi attivo
    } else {  // invece se onChange
      const value = e.target.value;
      let newImgUrl = '';
      if (value == "exit") newImgUrl = '/assets/uscita-emergenza.jpg';
      else if (value == "raccolta") newImgUrl = '/assets/raccolta.jpg';
      else if (value == "alert") newImgUrl = '/assets/alert.png';
      else newImgUrl = '/assets/location.png';
      const updatedMarkers = markers.map((marker) => 
        marker._id === markerId
          ? { ...marker, imgURL: newImgUrl , changed: true, type: value}
          : marker
      );   
      setMarkers(updatedMarkers);
    }
  };
  
  return (
    <div className='flex flex-col'>  
      <button style={{position: "fixed", top: 0, left: 0, 'marginTop': '10px', width: '100%', "backgroundColor": "lightgreen"}}
        onClick={handleSavePOI} disabled > 
        Map of Point Of Interest
      </button>      
      <MapContainer center={[40.57567910962963, 17.11605548858643]}
        zoom={15}     
        style={{ height: '400px', width: '100%', border: 'solid 2px black', position: "fixed", top: 60, left: 0 }}
        ref={mapRef} >      
        <TileLayer 
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {
          markers.filter(item => item.type === 'path').map((path, index) => {
            return (
                <AntPath key = {index} path={path} />
              )
          }) // ~ filter.map
        }

        <NewMarker setMarkers={setMarkers} markers={markers} newPOI={newPOI} setNewPOI={setNewPOI}/>    
        { 
          markers.filter(item => item.type !== 'path').map((marker, index) =>(
            <Marker
              key={marker._id}
              icon={L.icon({iconUrl:  marker.imgURL, iconSize: [30,30]})}
              position={[marker.lat, marker.lon]}
              draggable={true} 
              eventHandlers={{ dragend: (event) => handleMarkerDragEnd(marker._id, event), //gestisce lo spostamento del marker
                              click: (event) => handlePoiClick(index), //gestisce il click sul POI
              }}
              ref={(markerRef) => {
              // Aggiungi la ref corrente al vettore delle refs dei marker
                markerRefs.current[index] = markerRef;
              }}
            >
            <Popup className='text-justify'>{marker.text}</Popup>
            </Marker>
            ) // ~ callback in map
          ) //~ map
        }   
      </MapContainer> 
      <div style={{'marginTop': '430px' , "border":"2px solid black", "paddingBottom": "10px"}}  >
        <Elenco markers={markers} onMarkerSelect={handleSelectChange} onPopupChange={handlePopupChange} 
                setMarkers={setMarkers} inputRefs={inputRefs} newPOI={newPOI} setNewPOI={setNewPOI}
                oldPOI={oldPOI} setOldPOI={setOldPOI} setPoiDaCancellare={setPoiDaCancellare} handleSavePOI={handleSavePOI} 
        />      
      </div>  
    </div>
  ); //~ return
}; // ~ component <Test>
 
function Elenco ({ markers, onMarkerSelect, onPopupChange, setMarkers, inputRefs, newPOI, setNewPOI, oldPOI, setPoiDaCancellare, handleSavePOI ,setOldPOI})  { 
  
  const handleDeleteButton = ( markerId, event, index) =>{
    event.preventDefault();
    //setOldPOI(markers)
    const a = newPOI.findIndex((i) => i._id === markerId); // constrollo se l'elemento è nuovo
    if( a != -1) {  // se è tra i nuovi
      console.log('trovato elemento tra i nuovi');
      newPOI.splice(a,1); // lo tolgo da newPOI
      setNewPOI(newPOI); // e cambio lo stato
      const b = markers.filter(item => item._id != markerId); //elimino dalla lista l'elemento cancellato 
      setMarkers(b); // aggiorno la lista dei markers
    }  else { // se non è tra i nuovi allora è vecchio      
      let x = oldPOI.findIndex((i) => i._id === markerId);
      console.log('Trovato elemento vecchio', x, index);
      const vecchio = oldPOI.splice(x,1); 
      //setOldPOI(oldPOI); // aggiorno la lista dei vecchi POI
      //const vecchioPOI = oldPOI.splice(index,1)
      //setDeletedOldPOI(...deletedOldPOI, vecchioPOI ) // inserisco l'elemento cancellato nella lista dei vecchi poi cancellati
      //console.log('el can',vecchioPOI)
      /*const copy=oldPOI.map(x=>x);*/      
      //setOldPOI(oldPOI); // aggiorno la lista dei vecchi POI   
      console.log('invio al server da cancellare', markers[index]);  
      //setPoiDaCancellare(markers[index]); // lo rimando in app.jsx 
      setPoiDaCancellare(markers.filter(item => item._id === markerId));
    } 
    //inputRefs.current.splice(index,1)
    //markers.splice(index,1); // elimino il marker dalla lista dei marker 
    //const copy=markers.map(x =>x) // creo una copia della lista
    //setMarkers(copy) // e aggiorno lo stato,
    //setMarkers(markers) <=== questa non funziona!!!!
  }

  return (
    <div> 
      <h2>Elenco Point Of Interest</h2>   
      {markers.filter(items => items.type !== 'path').map((marker, index) => (  
        <div key={marker._id} className='mr-5 '>
          <input className="border-2 w-7 pr-1 text-right"  value={index+1} readOnly/>
          <input className="border-2 pl-1" value={marker.lat} readOnly />
          <input className="border-2" value={marker.lon} readOnly />
          <select className="border-2 " placeholder="Tipologia" required  defaultValue={marker.type} 
            onChange={(e) => onMarkerSelect(marker._id,e, index)} onClick={(e) => onMarkerSelect(marker._id,e, index)}>
            <option value="location">Location</option>
            <option value="alert">Alert</option>
            <option value="exit">Uscita Emergenza</option>
            <option value="raccolta">Punto Raccolta</option>
            </select>
          <input ref={(inputRef) => { // input per il testo del POI
              inputRefs.current[index] = inputRef; // Aggiungi la ref corrente al vettore delle refs dei input-text
            }}
            className="border-2 pl-1" 
            defaultValue={marker.text}  
            onClick={(e) => onPopupChange(marker._id,e, index, )}  
            onChange={(e) => onPopupChange(marker._id,e, index)}/>
          <button type="submit" className='border-slate-800 p-0 ml-1 w-16' onClick={(e) => handleDeleteButton(marker._id, e, index)} >Delete</button>
          {marker.changed ? <button type='submit' className='border-slate-800 p-0 ml-1 w-16 bg-lime-500' onClick={(e) => handleSavePOI(marker._id, e, index)}>Save</button> : null}
        </div>
      ))}
    </div> 
  );
}
/*
function NewMarker({setMarkers, markers, setNewPOI, newPOI}){  // inserisce nuovo marker col tasto dx del mouse
  
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
      //console.log('*******', newPOI) 
    } // ~ contexmenu
  })  // ~ useMapEvent
  return null;
} // ~ f
*/
export default Test;