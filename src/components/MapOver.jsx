import { useMap } from 'react-leaflet/hooks';
import L from "leaflet"

export default function MapOver (){
    const imageUrl = '/assets/temenide.jpg';
    const map = useMap();

    let errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
    let altText = ' immagine di via temenide a taranto';
    let latlngBounds = [[40.462823, 17.250030],[40.462024, 17.251737]];

    let imageOverlay = L.imageOverlay(imageUrl, latlngBounds, {
        opacity: 0.5,
        errorOverlayUrl: errorOverlayUrl,
        alt: altText,
        interactive: true,
    }).addTo(map);

    return null;

}