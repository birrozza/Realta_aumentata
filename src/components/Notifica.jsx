//import { useMap } from 'react-leaflet/hooks';
//import L from "leaflet";
//import Notifications from 'leaflet-notifications';
import React from 'react';

export default function Notifica () {
    /*const mymap = useMap();
    console.log('*********************in notification')
    let notification = L.control
    .notifications({
        timeout: 3000,
        position: 'topright',
        closable: true,
        dismissable: true,
    })
    .addTo(mymap);

    notification.info('Info', 'some infomessage');
    */
    console.log('*********************in notification')
    return (
        <>
            <dialog open>
                <p>Greetings, one and all!</p>
                <form method="dialog">
                    <button>OK</button>
                </form>
            </dialog>
        </>
    )
}
