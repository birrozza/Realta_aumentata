/*********************************
 *  l'inserimento di un nuovo POI
 *  viene gestito dal componente
 *  NewMarker ed è col tasto dx 
 *  https://github.com/iatkin/leaflet-svgicon
 *  https://github.com/cbaines/leaflet-indoor
 *  https://bopen.github.io/leaflet-area-selection/  
 *  https://github.com/ghybs/leaflet-defaulticon-compatibility
 * [40.58125469194737,17.104468850466237],[40.57197099511666,17.12703818134258]
 ********************************/

//import L from 'leaflet';
import * as React from 'react';
import { useState, useRef } from 'react';
import { TileLayer, MapContainer, } from 'react-leaflet';
import { ScaleControl } from 'react-leaflet/ScaleControl'
//import { useMap } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';
import AntPath from './AntPath';
import NewMarker from './NewMarker';
import MapOver from './MapOver';
import Slider from './Slider';
import Notifica from './Notifica';
import Poi from './Poi';
import Elenco from './Elenco';


export default function Test ({markers, setMarkers, setNuoviPoi, setPoiDaCancellare, notifica, setNotifica}){
  //const [markers, setMarkers] = useState(poi); 
  const [opacity, setOpacity] = useState(0.7);
  const [newPOI, setNewPOI] = useState([]);  // contiene i nuovi poi 
  const [oldPOI, setOldPOI] = useState(markers); // contiene i poi di origine che sono rimasti
  //const [deletedOldPOI, setDeletedOldPOI] = useState([{"i": 0}]) // lista dei vecchio POI cancellati
  //const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const markerRefs = useRef([]); // la lista di tutti gli elementi <Marker>
  const mapRef = useRef(); // riferimento alla mappa
  const inputRefs= useRef([]) // lista si tutti i tetxt <input> 
  const maxBounds = [[40.58125469194737,17.104468850466237],[40.57197099511666,17.12703818134258]];
  let posizione = {};
  
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
        } else if (index % 2 === 0) item.setAttribute("style","background-color: #eef") // ripristina tutti gli altri
          else item.setAttribute("style","background-color: #fff")                      // secondo il rigo
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
  }

  const handleMarkerDragEnd = (markerId, event) => {    // registra la posizione finale del marker
      let a = markers.find((a) => a._id === markerId).undo;
      console.log(a)
      if (a) a=a.concat(posizione)
      else a=posizione
      
      console.log('in end', a)
      const updatedMarkers = markers.map((marker) =>
        marker._id === markerId
          ? { ...marker, lat: event.target._latlng.lat, lon: event.target._latlng.lng, undo: a, isUndo: true }
          : marker
      );    
      setMarkers(updatedMarkers);  
  };

  const handleMarkerDragStart = (markerId, event) => {    // registra la posizione iniziale del marker
    console.log('in start', )    
      const a = [{position: [event.target._latlng.lat, event.target._latlng.lng]}]
      posizione = a;
  };  

  const handlePopupChange = (markerId, e, i) => { //per modificare il contenuto del popup
    console.log('event: ',e, inputRefs.current[i].title)
    const value = e.target.value; // recupera cio' che è digitato nell'input-text
    //const isChange = e.type == 'change' ? true : markers[i].changed; // verifica se c'è una modifica nel testo
    handlePoiClick(i); // evidenzia l'input-text del marker selezionato
    markerRefs.current[i].openPopup(); // attiva il popup sull'elemento individuato
    const {lat, lng} = markerRefs.current[i]._latlng; //prendi le coordinate del popup attivo 
    mapRef.current.flyTo([lat,lng], 20); // punta la mappa sul poi selezionato
    markerRefs.current[i].openPopup(); // attiva il popup sull'elemento individuato
    //mapRef.current.setZoom(20)
    if (e.type != 'change') {
      posizione = [{text: e.target.value}];
      return;
    }
    /*let a = markers.find((a) => a._id === markerId).undo;
    console.log(a)
    if (a) a=a.concat(posizione)
    else a=posizione  */

    const updatedMarkers = markers.map((marker) =>
      marker._id === markerId
        ? { ...marker, text: value, id_img: value, id_text: 'text-'+ value, changed: (marker.oldText === value? false: true), }
        : marker
    ); // ~ map  
    setMarkers(updatedMarkers);
  } // ~ f
  
  const handleSelectChange = (markerId, e, index) => { // per modificare l'immagine dell'icona
    let a = markers.find((a) => a._id === markerId).undo; // prendo ciò che c'è in undo
    const type =  markers.find((a) => a._id === markerId).type; //prendo il valore attuale del type 

    markerRefs.current[index].openPopup(); // attiva il popup sull'elemento individuato
    if (e.type == 'click') { // se è solo click
        const {lat, lng} = markerRefs.current[index]._latlng; //prendi le coordinate del poi attivo 
        mapRef.current.flyTo([lat,lng], 18) // punta la mappa sul poi attivo
    } else {  // invece se onChange
      console.log(type)
      if (a) a.push({type: type}) // se la key undo è già presente, accodo l'oggetto
      else a=[{type: type}] // se non è presente, aggiungo il primo elemento
      const value = e.target.value;
      let newImgUrl = '';
      if (value == "exit") newImgUrl = '/assets/uscita-emergenza.jpg';
      else if (value == "raccolta") newImgUrl = '/assets/raccolta.jpg';
      else if (value == "alert") newImgUrl = '/assets/alert.png';
      else newImgUrl = '/assets/location2.png';
      const updatedMarkers = markers.map((marker) => 
        marker._id === markerId
          ? { ...marker, imgURL: newImgUrl , isUndo: true, type: value, undo: a}
          : marker
      );   
      setMarkers(updatedMarkers);
    }
  };
  
  const handleMapLock = (e) => { // gestisci il lock della mappa
    if(mapRef.current.options.maxBounds === null) { // se la mappa non è bloccata
      mapRef.current.setMaxBounds(maxBounds); // imposta i limiti
      mapRef.current.setZoom(15) // riduci lo zoom
      mapRef.current.setMinZoom(15) // imposta lo zoom minimo a 15
      e.target.innerText = 'Map of Point Of Interest (locked)'; // cambia il testo del tasto
      e.target.style.backgroundColor= 'orange'; // cambia il colore del tasto
    }
    else { // se la mappa è bloccata
      mapRef.current.setMaxBounds([]); // elimina i limiti
      mapRef.current.setMinZoom(10) // imposta lo zoom minimo a 15
      e.target.innerText = 'Map of Point Of Interest'; // cambia il testo del tasto
      e.target.style.backgroundColor= 'lightgreen'; // cambia il colore del tasto
    }     
  } 
  
  return (
    <div className=' grid-cols-1 p-0 m-0'>  
      <button style={{position: "fixed", top: 0, left: 0, 'margin': '5px', width: '99%', "backgroundColor": "lightgreen", border: 'solid 2px black'}}
        onClick={(e) => handleMapLock(e)}  // gestisci il loc della mappa
        title='Map lock/unlock'
      > 
        Map of Point Of Interest
      </button>   
      <MapContainer center={[40.57567910962963, 17.11605548858643]}
        maxBounds={[]}
        minZoom={10}
        zoom={16}     
        style={{ height: 'calc(55vh - 30px)', width: '99%', border: 'solid 1px black', position: "fixed", top: "60px", left: "0px", 
        boxShadow: '3px 3px 6px #303030', margin: '0 5px', borderRadius: '5px', boxSizing: 'border-box', overflow: 'hidden'}}
        ref={mapRef} 
        mouseDown={(e)=> console.log(e)}>
        
        <ScaleControl />
        <Slider setOpacity = {setOpacity} opacity = {opacity}/>   
        <TileLayer 
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom = "21"
        />
        <MapOver opacity = {opacity} />        
        {
          markers.filter(item => item.type === 'path').map((path, index) => {
            return (
                <AntPath key = {index} path={path} />
              )
          }) // ~ filter.map
        }
        <Notifica notifica = {notifica} />
        <NewMarker setMarkers={setMarkers} markers={markers} newPOI={newPOI} setNewPOI={setNewPOI} />    
        {
          markers.filter(item => item.type !== 'path').map((marker, index) =>{
            return (
              <Poi 
                key={marker._id} 
                marker={marker} 
                index={index}
                handleMarkerDragEnd={handleMarkerDragEnd}
                handleMarkerDragStart={handleMarkerDragStart} 
                handlePoiClick={handlePoiClick} 
                markerRefs= {markerRefs}
                /> 
            ) // ~ return  
          }) // ~ map   
        }
      </MapContainer> 
      
      <div style={{marginTop: 'calc(60vh - 20px)' , border: '1px solid black', paddingBottom: "10px", 
                    overflowY: "auto",  height: 'calc(35vh - 20px)', 'boxShadow':'3px 3px 6px #303030', borderRadius: '5px',
                    padding: '5px 10px', fontFamily: 'source-code-pro,Menlo,Monaco,Consolas,"Courier New",monospace' }}  >
        <Elenco markers={markers} onMarkerSelect={handleSelectChange} onPopupChange={handlePopupChange} 
                setMarkers={setMarkers} inputRefs={inputRefs} newPOI={newPOI} setNewPOI={setNewPOI}
                oldPOI={oldPOI} setOldPOI={setOldPOI} setPoiDaCancellare={setPoiDaCancellare} handleSavePOI={handleSavePOI} 
                mapRef={mapRef}
        />      
      </div>  
    </div>
  ); //~ return
} // ~ component <Test>
/* 
function Elenco ({ markers, onMarkerSelect, onPopupChange, setMarkers, inputRefs, newPOI, setNewPOI, oldPOI, setPoiDaCancellare, handleSavePOI })  { 
  
  const handleUndoPOI = (markerId, e, i) =>{ // gestisce il pulsate 'undo poi'
    let changed = true;
    const marker = markers.find((a) => a._id === markerId); //prendo copia del marker in oggetto
    const b= marker.undo.pop(); // prendo l'ultima variazione che deve essere ripristinata
    if (marker.undo.length < 1) changed=false
    let type = marker.type; // prendo il type del marker
    let lat = marker.lat;
    let lon = marker.lon;
    let newImgUrl = marker.imgURL;
    if ('position' in b ) {
      lat = b.position[0]
      lon = b.position[1]
      console.log('era una posizione', lat, lon, changed)
    }
    else if ('type' in b ) {
      console.log('era una type', type)
      type = b.type;
      if (type == "exit") newImgUrl = '/assets/uscita-emergenza.jpg';
      else if (type == "raccolta") newImgUrl = '/assets/raccolta.jpg';
      else if (type == "alert") newImgUrl = '/assets/alert.png';
      else newImgUrl = '/assets/location2.png';
    }
    const updatedMarkers = markers.map((marker) =>
    marker._id === markerId
      ? { ...marker, imgURL: newImgUrl, lat: lat, lon: lon, type: type,  changed: changed }
      : marker
    );    
    setMarkers(updatedMarkers);
  }

  const handleDeleteButton = ( markerId, event, index) =>{ // gestisci il pulsante 'save'
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
      const a = markers.filter(item => item._id === markerId); // prendo l'elemento da cancellare
      console.log('invio al server da cancellare', a[0]);  // filter mi genera un array col solo elemento da cancellare
      setPoiDaCancellare(a[0]); // lo rimando in app.jsx
    } 
  }
  return (
    <div> 
      <h2 className="text-blue-600 font-bold">Elenco Point Of Interest</h2>   
      {markers.filter(items => items.type !== 'path').map((marker, index) => (  
        <div key={marker._id} className='mr-5'>
          <input className='border-2 w-7 pr-1 text-right'  value={index+1} style={{backgroundColor: index % 2 === 0 ? '#eef' : 'white'}} readOnly/>
          <input className="border-2 pl-1" value={marker.lat} style={{backgroundColor: index % 2 === 0 ? '#eef' : 'white'}} readOnly />
          <input className="border-2" value={marker.lon} style={{backgroundColor: index % 2 === 0 ? '#eef' : 'white'}} readOnly />
          <select className="border-2 " placeholder="Tipologia"  value={marker.type} style={{backgroundColor: index % 2 === 0 ? '#eef' : 'white'}} 
            onChange={(e) => onMarkerSelect(marker._id,e, index)} onClick={(e) => onMarkerSelect(marker._id,e, index)}>
            <option value="location">Location</option>
            <option value="alert">Alert</option>
            <option value="exit">Uscita Emergenza</option>
            <option value="raccolta">Punto Raccolta</option>
          </select>
          <input ref={(inputRef) => { // input per il testo del POI
              inputRefs.current[index] = inputRef; // Aggiungi la ref corrente al vettore delle refs dei input-text
            }}
            style={{backgroundColor: index % 2 === 0 ? '#eef' : 'white'}}
            className="border-2 pl-1" 
            defaultValue={marker.text}  
            onSubmit = {(e) => console.log('onsubmit',e)}
            onClick={(e) => onPopupChange(marker._id,e, index, )}  
            onChange={(e) => onPopupChange(marker._id,e, index)}/>
          <button type="submit" className='border-slate-800 p-0 ml-1 w-16 bg-slate-50' onClick={(e) => handleDeleteButton(marker._id, e, index)} >Delete</button>
          {marker.changed ? <button type='submit' className='border-slate-800 p-0 ml-1 w-16 bg-lime-500' onClick={(e) => handleSavePOI(marker._id, e, index)}>Save</button> : null}
          {marker.changed ? <button type='submit' className='border-slate-800 p-0 ml-1 w-16 bg-amber-500' onClick={(e) => handleUndoPOI(marker._id, e, index)}>Undo</button> : null}  
        </div>
      ))}
    </div> 
  );
}
*/
/*
net stop winnat
net start winnat
*/