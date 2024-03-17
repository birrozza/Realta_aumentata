import { useMap } from "react-leaflet/hooks";

export default function Elenco ({ markers, onMarkerSelect, onPopupChange, setMarkers, inputRefs, newPOI, setNewPOI, oldPOI, setPoiDaCancellare, handleSavePOI ,mapRef})  { 
  
    //const map=useMap();
    const handleUndoPOI = (markerId, e, i) =>{ // gestisce il pulsate 'undo poi'
      let isUndo = true;
      //let changed = true;
      const marker = markers.find((a) => a._id === markerId); //prendo copia del marker in oggetto
      const b= marker.undo.pop(); // prendo l'ultima variazione che deve essere ripristinata
      if (marker.undo.length < 1) isUndo=false
      let type = marker.type; // prendo il type del marker
      let lat = marker.lat;
      let lon = marker.lon;
      let newImgUrl = marker.imgURL;
      if ('position' in b ) {
        lat = b.position[0]
        lon = b.position[1]
        console.log('era una posizione', lat, lon, isUndo)
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
        ? { ...marker, imgURL: newImgUrl, lat: lat, lon: lon, type: type, isUndo: isUndo  }
        : marker
      );    
      setMarkers(updatedMarkers);
      mapRef.current.flyTo([lat,lon], 18) // punta la mappa sul poi attivo
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
              onChange={(e) => onPopupChange(marker._id,e, index)}
              title = {`Old text: "${marker.oldText}"`}
            />
            <button type="submit" className='border-slate-800 p-0 ml-1 w-16 bg-slate-50' onClick={(e) => handleDeleteButton(marker._id, e, index)} >Delete</button>
            {marker.changed || marker.isUndo ? <button type='submit' className='border-slate-800 p-0 px-1.5 ml-1 w-18 bg-lime-500' onClick={(e) => handleSavePOI(marker._id, e, index)}>{marker.changed && !marker.isUndo? 'Save Text': 'Save'}</button> : null}
            {marker.isUndo  ? <button type='submit' className='border-slate-800 p-0 ml-1 w-16 bg-amber-500' onClick={(e) => handleUndoPOI(marker._id, e, index)}>Undo</button> : null}  
          </div>
        ))}
      </div> 
    );
}