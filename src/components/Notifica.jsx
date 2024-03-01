/*******
 * https://gitlab.com/manuel.richter95/leaflet.notifications
 *******/

import { useMap } from 'react-leaflet/hooks';
import L from "leaflet";
import './leaflet-notifications/leaflet-notifications.js'
import './leaflet-notifications/leaflet-notifications.css'
//import './leaflet-notifications/font-awesome.min.css'
import { useEffect } from 'react';

function Notifica ( { notifica } ){
    const mymap = useMap();
    //console.log('*****',notifica.type)
    
    useEffect (() => {
        let notification = L.control
        .notifications({
            //className: 'pastel',
            timeout: 3000,
            position: 'bottomright',
            closable: true,
            dismissable: true,
            marginLeft: '10px',
            icons: {alert: 'fa fa-exclamation-circle'}
            
        })
        .addTo(mymap);

        switch (notifica.type) {
            case 'succes': notification.success('SUCCES', `<em>${notifica.msg}</em>`);
                break;
            case 'alert': notification.alert('ALERT', `<em>${notifica.msg}</em>`);
                break;  
            default: null; 
        }
        return () => {            
            notification.remove();            
        }
    }, [notifica])
    
    return null;
}

export default Notifica;
