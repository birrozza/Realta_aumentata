// avvio server: npm run server
// con ipconfig trova l'ip (IPV4)
// https://192.168.1.59:3000/
// Angelo
// floriana
// mongodb+srv://Angelo:floriana@cluster0.aq0nagc.mongodb.net/AR_DB?retryWrites=true&w=majority
/***********************************************************
 * IMPORTANTE: per poter usare questa versione con mongoose, 
 * inserire in package.json la chiave "type": "module"
 * e usare import al posto di require
 ***********************************************************/

//const express = require('express')
import express from 'express';
//const https = require('https');
import https from 'https';
//const fs = require('fs');
import fs from 'fs';
//const mongoose = require('mongoose');
import  bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { setInterval } from 'timers/promises';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let data = []; 
const app = express();
let pathItems = [{
    type: "path",
    name: "path1",
    path: [
        [40.58149728574267, 17.123394012451175],
        [40.57734149729511, 17.12176322937012],
        [40.57572800397406, 17.118930816650394],
        [40.571180677081266, 17.123115062713627],
      ],
    eta: [
      1707589900088,
      1707589998886,
      1707590032165
    ]  
  },{
    type: "path",  
    name: "path2",
    path: [
        [40.57714999886029, 17.117072045803074],
        [40.57731705071694, 17.116886973381046],
        [40.5770277655302, 17.114875316619877],
        [40.5785352943267, 17.112970948219303],
      ],
    eta: [
      1707589900088,
      1707589998886,
      1707590032165
    ] 
}];

app.use('/assets', express.static('assets')); // per poter recuperare i file immagine
//app.use('/src', express.static('src')); // per poter recuperare i file immagine
app.use(bodyParser.json())

// Abilita CORS per tutte le route
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const port = process.env.PORT || 3000;

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}
const server = https.createServer(options, app);

mongoose.set("strictQuery", false);
const mongodb = "mongodb+srv://Angelo:floriana@cluster0.aq0nagc.mongodb.net/AR_DB?retryWrites=true&w=majority";

// definisci lo schema
const schema = new mongoose.Schema({
    id_text: String,
    id_img: String,
    type: String,
    text: String,
    imgURL: String,
    lat: Number,
    lon: Number,
    //remove: Boolean,
});

// coMpila il modello
const POI = mongoose.model("POI", schema) 

function recuperaPoi(){
    POI.find({}).then((documenti) => {
        console.log(' Elementi trovati: ',documenti.length);
        data = documenti;
        data.map(item =>{
            switch (item.type) {
              case "location": item.imgURL = '/assets/location.png';              
                break;
              case "alert": item.imgURL = '/assets/alert.png';              
                break;
              case "raccolta": item.imgURL = '/assets/raccolta.jpg';              
                break;      
              case "exit": item.imgURL = '/assets/uscita-emergenza.jpg';              
                break;
            } // ~ swith
        }); // ~ map
        return "ok"
    })
    .catch((err) => console.log("errore durante il recupero dei documenti", err))
}

mongoose.connect(mongodb/*, {useNewUrlParser: true, useUnifiedTopology: true}*/)
    .then(()=>{
        console.log(' Connessione a mongoDB con mongoose ok ...');
        // recupera dati
        recuperaPoi(); 
        //console.log('avvio il recupero POI ciclico');    
        //globalThis.setInterval(() => recuperaPoi(), 10000); // 
        server.listen(port, () => console.log(` Server running at https://localhost:${port}/\n or https://192.168.1.62:3000/\n verify width ipconfig (IPV4)`));
 
    }).catch(err => console.log("errore durante la connessione a mongoDB", err));

app.get('/', (req, res) =>{
    res.send('<h1>Hello World!!!</h1><h2>By Angelo MIRABELLI</h2>');
});

// risponde alle richieste di dati delle webapp
app.get('/directory', (req, res) => { // `/directory?id=${unicID}&b=val2`
    let {id, lat, lon, eta} = req.query; // dissocio i parametri 
    if (lat !== "0" && !isNaN(lat)) { // se mi sono arrivati i dati del gps
      lat = parseFloat(lat);
      lon = parseFloat(lon);
      
      const found = pathItems.find(i => i.name == id); // verifico se l'elemento è già registrato
      if (found) { // se è già registrato aggiorno le ccordinate gps
        console.log(`aggiungo coordinate gps a ${id}`)
        console.log(found.path)
        found.path.push([lat, lon]);
        found.eta.push(parseInt(eta));
        //console.log(pathItems[found])
      } else { // id sconosciuto allora lo aggiungo
        console.log(`Aggiungo a pathItems l'elemento ${id} `)
        const obj = {
          name: id,
          type: "path",
          path: [[lat, lon]],
          eta: [parseInt(eta)] 
        };
        pathItems.push(obj);
        console.log(pathItems)     
      } // ~ found / not found
    }
    const json = [...data, ...pathItems];
    res.status(200).json(json);
    console.log('Send ok -', id,  lat, lon, eta)
  }
); // ~ get

// Endpoint per inserire un oggetto nel database
app.post('/addpoi', async (req, res) => {
  console.log('in addpoi per: ',req.body._id, req.body.type)
  const nuovoOggettoPOI = {
        id_text: req.body.id_text,
        id_img: req.body.id_img,
        type: req.body.type,
        text: req.body.text,
        imgURL: req.body.imgURL,
        lat: req.body.lat,
        lon: req.body.lon,        
      }
  const nuoviPOI = new POI( nuovoOggettoPOI );// Crea un'istanza del modello Mongoose con i dati ricevuti nella richiesta
  try {
    const sePresente = await POI.find({_id: req.body._id})//.exec(); // verifica se l'oggetto è già nel database
    if (sePresente.length > 0) {
      console.log('elemento già presente', sePresente)
      POI.replaceOne({ _id: req.body._id}, nuovoOggettoPOI)
        .then((res) => {
          console.log('update con successo')
          recuperaPoi();
        })
        .catch((err) => console.log('err in update', err))
      res.status(201).json({ status: 'update success' }); // quindi invia success
    } else { //
      console.log("In /addpoi: elemento non presente, lo aggiungo...", sePresente)
      // Salva gli array di POI nel database
      const salvataggio = await POI.insertMany(nuoviPOI); // attendi che si risolva questa operazione
      
      res.status(201).json({ status: 'add success', object: salvataggio }); // quindi invia success e l'elemento appena salvato
    }
    recuperaPoi();    
  } catch (error) {
    console.error('Errore durante l\'inserimento nel database:', error);
    return res.status(500).json({ status: 'Errore interno del server' });
  }
});
   
// Endpoint per eliminare un elemento
app.delete('/delete', async (req, res) => {
  
  const {id} = req.query; 
  console.log('Richiesta cancellazione id: ', id);
  try {
    // Utilizza il modello Mongoose per eliminare l'elemento
    const risultato = await POI.findByIdAndDelete(id);
    if (!risultato) {
      console.log("elemento non trovato")
      return res.status(404).json({ status: 'Elemento non trovato'});
    }
    console.log(`id: ${id} cancellato`)
    recuperaPoi()
    return res.status(201).json({ status: 'success' }); // quindi invia success
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ status: "Errore durante l'eliminazione dell'elemento" });
  }
});

app.get('/app', (req, res) => {
    res.sendFile('app.html',{root: __dirname +'/'})
})

app.get('/mappa', (req, res) => {
    res.sendFile('index.html',{root: __dirname +'/dist/'})
  })



//server.listen(port, () => console.log(`Server running at https://localhost:${port}/\nor https://192.168.1.59:3000/\nverify width ipconfig (IPV4)`));
    
// Insert the article in our MongoDB database
//await POI.create(data);
//const a = await doc.find();
//console.log(a)


