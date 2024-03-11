// test2 = R39HvJBzewVVyJN3zV3oAH5oSHJnmDmVpRRWHsfnuTS7sr5peftD2iMtk9smEKSs
// npm run client
import Test from './components/Test';
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  
  //const localURL = 'https://localhost:3000'; // per mongooseserver
  const localURL = ''; //per renderserver
  const [markers, setMarkers] = useState([]); 
  const [nuoviPoi, setNuoviPoi] = useState([])
  const [poiDaCancellare, setPoiDaCancellare] = useState([])
  const [notifica, setNotifica] = useState({type:'idle', msg: ''})
  
  useEffect(()=>{  // eliminazione poi    
    if (poiDaCancellare.length<1) return;
    console.log('in app => elemento da cancellare', poiDaCancellare)
    const idPoiDaCancellare = poiDaCancellare._id;     
        
    //const url = `https://localhost:3000/delete?id=${idPoiDaCancellare}` // per mongooseserver
    const url = localURL + `/delete?id=${idPoiDaCancellare}` // per rendererver
    fetch(url , 
        {
          method: 'DELETE', 
          /*body: JSON.stringify(poiDaCancellare),
          headers: {'Content-Type': 'application/json'},*/
        }
      )
      .then(res => res.json())
      .then(risposta => { 
          if (risposta.status == 'success') {
            //alert(`Elemento eliminato con successo`)
            setNotifica({type: 'succes', msg: 'Elemento eliminato con successo'})
            const a = markers.filter(item => item._id != idPoiDaCancellare); // aggiorno eliminando l'elemento 
            setMarkers(a);
            console.log('Risposta server ', risposta)
          } else throw Error(risposta.status)
        }
      )
      .catch(err => {
        console.log("errore col server", err)
        //alert(`Errore collegamento server \n${err}`)
        setNotifica({type: 'alert', msg: `Errore collegamento server \n${err}`})
        //setMarkers([...markers, copiaPoiDaCancellare[0]]); // reinserito in coda
        //setMarkers(copiaPoi)
      })
    },[poiDaCancellare]
  )

  useEffect(()=>{  // aggiornamento/inserimento poi
    if (nuoviPoi.length < 1) return;
    console.log('in app aggiornare', nuoviPoi)
    const oldID = nuoviPoi._id; // prendo id provvisorio del nuovo poi
    fetch(localURL + '/addpoi', // effettuo chiamata per renderserver
    //fetch('https://localhost:3000/addpoi', // effettuo chiamata per mongooseserver
        {
          method: 'POST', 
          body: JSON.stringify(nuoviPoi),
          headers: {'Content-Type': 'application/json'},
        }
      )
      .then(res => res.json())
      .then(risposta => {
          let updatedMarkers = []
          let msg = `Elemento aggiunto con successo`;  
          console.log('Risposta server ', risposta);
          if (risposta.status == 'add success') { // se l'aggiunta di un elemento è ok           
            console.log('aggiorno _id nuovo elemento');
            updatedMarkers = markers.map((marker) => // sostituisco id provvisorio
             marker._id === oldID                           // con quello definitivo di mongoDB
              ? { ...marker, _id: risposta.object[0]._id, changed: false} // e disabilito il tasto 'add'
              : marker
            ); //~ map
          } else if (risposta.status == 'update success') { // se l'aggiornamento di un elemento è ok   
            msg = `Elemento aggiornato con successo`;
            console.log('setto changed: false');
            updatedMarkers = markers.map((marker) => 
             marker._id === oldID                           
              ? { ...marker, changed: false} // e disabilito il tasto 'save'
              : marker
            ); //~ map
          } else console.log('risposta non gestita', risposta);
          setMarkers(updatedMarkers); // aggiorno lo stato della lista dei markers
          //alert(msg);
          setNotifica({type: 'succes', msg: msg})       
        } 
      )
      .catch(err => {
        console.log("errore col server", err)
        //alert(`Aggiorna la pagina...\nErrore collegamento server \n${err}`)
        setNotifica({type: 'alert', msg: `Aggiorna la pagina...\nErrore collegamento server \n${err}`})
      })
    },[nuoviPoi]
  )
  // uso server
  useEffect(() => { // recupera i dati all'avvio
    fetch(localURL + "/directory?id=react&b=val2", // per renderserver 
    //fetch("https://localhost:3000/directory?id=mappa&b=val2",  // per mongooseserver
      {mode: 'cors', headers: { 'Content-Type': 'application/json',}})
    .then(response => {
      if(!response.ok){
          console.log("Error: promise reject");
          throw Error(response.statusText)
          //return Promise.reject(response);
      }
      return response.json();
    })
    .then(data => {
      console.log('in app, dati ricevuti: ',data);
      //setPoi(data);     
      setMarkers(data)
    })
    .catch(e => {
      console.log(e);
      alert(`Errore collegamento server \nFai un refresh della pagina...\n${e}`);      
    });
  },[]);
  
  if (markers.length>0){
    return  (
      <>
        <Test markers={markers} setMarkers={setMarkers} setNuoviPoi={setNuoviPoi} setPoiDaCancellare={setPoiDaCancellare} 
              notifica={notifica} />        
      </>
    ) 
  } else console.log('In App.jsx: attesa dati')
}

export default App
