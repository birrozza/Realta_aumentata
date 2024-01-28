//import React from "react";
import { useState } from "react";


function Elenco({poi}) {

    const { elemento, setElemento} = useState();

    return (
        <>
            {poi.map((item, index) =>(
                <div key={item._id} >
                    <input className="border-2 w-6" value={index} />
                    <input className="border-2" value={item.lat} />
                    <input className="border-2" value={item.lon} />
                    <select className="border-2" placeholder="Tipologia" required onChange={(e)=>console.log(item._id,e.target.value)} defaultValue={item.type}>
                        <option value="location">Location</option>
                        <option value="alert">Alert</option>
                        <option value="exit">Uscita Emergenza</option>
                        <option value="raccolta">Punto Raccolta</option>
                    </select>
                    <input className="border-2 w-2/6" value={item.text} onChange={e => console.log(e)}/>
                </div>
            ))}
        </>
    )
}

export default Elenco;