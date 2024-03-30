import { useMap } from "react-leaflet/hooks";

export default function Elenco({
  markers,  
  onPopupChange,
  setMarkers,
  inputRefs,
  newPOI,
  setNewPOI,
  oldPOI,
  setPoiDaCancellare,
  handleSavePOI,
  mapRef,
  markerRefs
}) {
  //const map=useMap();
  //let varGenerica = 0; // contenitore generico

  const onMarkerSelect = (markerId, e, index) => {
    // per modificare l'immagine dell'icona
    let a = markers.find((a) => a._id === markerId).undo; // prendo ciò che c'è in undo
    const type = markers.find((a) => a._id === markerId).type; //prendo il valore attuale del type

    markerRefs.current[index].openPopup(); // attiva il popup sull'elemento individuato
    if (e.type == "click") {
      // se è solo click
      const { lat, lng } = markerRefs.current[index]._latlng; //prendi le coordinate del poi attivo
      mapRef.current.flyTo([lat, lng], 18); // punta la mappa sul poi attivo
    } else {
      // invece se onChange
      console.log(type);
      if (a)
        a.push({
          type: type,
        }); // se la key undo è già presente, accodo l'oggetto
      else a = [{ type: type }]; // se non è presente, aggiungo il primo elemento
      const value = e.target.value;
      let newImgUrl = "";
      if (value == "exit") newImgUrl = "/assets/uscita-emergenza.jpg";
      else if (value == "raccolta") newImgUrl = "/assets/raccolta.jpg";
      else if (value == "alert") newImgUrl = "/assets/alert.png";
      else newImgUrl = "/assets/location2.png";
      const updatedMarkers = markers.map((marker) =>
        marker._id === markerId
          ? { ...marker, imgURL: newImgUrl, changed: true, type: value, undo: a }
          : marker
      );
      setMarkers(updatedMarkers);
    }
  };
  
  const handleUndoPOI = (markerId, e, i) => {
    // gestisce il pulsate 'undo poi'
    let changed = true;
    const marker = markers.find((a) => a._id === markerId); //prendo copia del marker in oggetto
    const b = marker.undo.pop(); // prendo l'ultima variazione che deve essere ripristinata
    if (marker.undo.length < 1) changed = false;
    let type = marker.type; // prendo il type del marker
    let lat = marker.lat;
    let lon = marker.lon;
    let newImgUrl = marker.imgURL;
    let text = marker.text;
    if ("position" in b) {
      lat = b.position[0];
      lon = b.position[1];
      console.log("Undo: era una posizione", lat, lon, changed);
    } else if ("type" in b) {
      console.log("Undo: era una type", type);
      type = b.type;
      if (type == "exit") newImgUrl = "/assets/uscita-emergenza.jpg";
      else if (type == "raccolta") newImgUrl = "/assets/raccolta.jpg";
      else if (type == "alert") newImgUrl = "/assets/alert.png";
      else newImgUrl = "/assets/location2.png";
    } else if ("text" in b) {
      text = b.text;
      console.log("Undo: era un text", type)
    }
    const updatedMarkers = markers.map((marker) =>
      marker._id === markerId
        ? {
            ...marker,
            imgURL: newImgUrl,
            lat: lat,
            lon: lon,
            type: type,
            changed: changed,
            text: text,
            id_img: text,
            id_text: "text-" + text,
          }
        : marker
    );
    setMarkers(updatedMarkers);
    mapRef.current.flyTo([lat, lon], 18); // punta la mappa sul poi attivo
  };

  const handleDeleteButton = (markerId, event, index) => {
    // gestisci il pulsante 'save'
    event.preventDefault();
    const a = newPOI.findIndex((i) => i._id === markerId); // constrollo se l'elemento è nuovo
    if (a != -1) {
      // se è tra i nuovi
      console.log("trovato elemento tra i nuovi");
      newPOI.splice(a, 1); // lo tolgo da newPOI
      setNewPOI(newPOI); // e cambio lo stato
      const b = markers.filter((item) => item._id != markerId); //elimino dalla lista l'elemento cancellato
      setMarkers(b); // aggiorno la lista dei markers
    } else {
      // se non è tra i nuovi allora è vecchio
      let x = oldPOI.findIndex((i) => i._id === markerId);
      console.log("Trovato elemento vecchio", x, index);
      const vecchio = oldPOI.splice(x, 1);
      const a = markers.filter((item) => item._id === markerId); // prendo l'elemento da cancellare
      console.log("invio al server da cancellare", a[0]); // filter mi genera un array col solo elemento da cancellare
      setPoiDaCancellare(a[0]); // lo rimando in app.jsx
    }
  };

  const handleBlur = (markerId, event, index) => {
    const value = event.target.value;
    const item = markers.find(a => a._id === markerId );
    if (value !== item.oldText) { // se il testo e variato
      console.log('*** in handleBlur testo variato', value, item.oldText);
      let undo = item.undo; 
      if (undo) undo = undo.concat([{text: item.oldText}]);
      else undo = [{text: item.oldText}];
      const updatedMarkers = markers.map((marker) =>
      marker._id === markerId
        ? {
            ...marker,
            oldText: value,
            text: value,
            id_img: value,
            id_text: "text-" + value,
            changed: true,
            undo: undo,
          }
        : marker
      ); // ~ map
      
      setMarkers(updatedMarkers);
    }
    else console.log('in handleBlur testo invariato')
  };

  return (
    <div>
      <h2 className="text-blue-600 font-bold">Elenco Point Of Interest</h2>
      {markers
        .filter((items) => items.type !== "path")
        .map((marker, index) => (
          <div key={marker._id} className="mr-5">
            <input
              className="border-2 w-7 pr-1 text-right"
              value={index + 1}
              style={{ backgroundColor: index % 2 === 0 ? "#eef" : "white" }}
              readOnly
            />
            <input
              className="border-2 pl-1"
              value={marker.lat}
              style={{ backgroundColor: index % 2 === 0 ? "#eef" : "white" }}
              readOnly
            />
            <input
              className="border-2"
              value={marker.lon}
              style={{ backgroundColor: index % 2 === 0 ? "#eef" : "white" }}
              readOnly
            />
            <select
              className="border-2 "
              placeholder="Tipologia"
              value={marker.type}
              style={{ backgroundColor: index % 2 === 0 ? "#eef" : "white" }}
              onChange={(e) => onMarkerSelect(marker._id, e, index)}
              onClick={(e) => onMarkerSelect(marker._id, e, index)}
            >
              <option value="location">Location</option>
              <option value="alert">Alert</option>
              <option value="exit">Uscita Emergenza</option>
              <option value="raccolta">Punto Raccolta</option>
            </select>
            <input
              ref={(inputRef) => {
                // input per il testo del POI
                inputRefs.current[index] = inputRef; // Aggiungi la ref corrente al vettore delle refs dei input-text
              }}
              style={{ backgroundColor: index % 2 === 0 ? "#eef" : "white" }}
              className="border-2 pl-1"
              value={marker.text}
              /*onSubmit={(e) => console.log("onsubmit", e)}*/
              onClick={(e) => onPopupChange(marker._id, e, index)}
              onChange={(e) => onPopupChange(marker._id, e, index)}
              onBlur={(e) => handleBlur(marker._id, e, index)}
              title={`Old text: "${marker.oldText}"`}
            />
            <button
              type="submit"
              className="border-slate-800 p-0 ml-1 w-16 bg-slate-50 hover:bg-slate-300 duration-200 transition"
              onClick={(e) => handleDeleteButton(marker._id, e, index)}
            >
              Delete
            </button>
            {marker.changed  ? (
              <button
                type="submit"
                className="border-slate-800 p-0 px-1.5 ml-1 w-18  bg-lime-300 hover:bg-lime-500 duration-200 transition"
                onClick={(e) => handleSavePOI(marker._id, e, index)}
              >
                Save
              </button>
            ) : null}
            {marker.changed && marker.hasOwnProperty('undo') ? (
              <button
                type="submit"
                className="border-slate-800 p-0 ml-1 w-16 bg-amber-300 hover:bg-amber-500 active:bg-amber-700 transition duration-200"
                onClick={(e) => handleUndoPOI(marker._id, e, index)}
              >
                Undo-{marker.undo.length}
              </button>
            ) : null}
          </div>
        ))}
    </div>
  );
}
