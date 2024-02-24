// https://rubenspgcavalcante.github.io/leaflet-ant-path/
import { useMap } from 'react-leaflet/hooks';
import { antPath } from 'leaflet-ant-path';
import { useEffect } from 'react';

export default function AntPath({ path }){
    const map = useMap()
    //if (path == null) return

    useEffect (() => {
        
        const pathLatLng = path.path;
        let colori = [
            "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", 
            "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", 
            "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", 
            "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", 
            "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", 
            "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", 
            "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", 
            "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", 
            "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", 
            "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", 
            "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", 
            "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", 
            "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", 
            "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", 
            "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", 
            "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", 
            "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", 
            "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", 
            "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", 
            "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", 
            "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", 
            "yellow", "yellowgreen"
        ];
        let indiceCasuale = Math.floor(Math.random() * colori.length);
        const eta = new Date(path.eta[path.eta.length-1] - path.eta[0])
        //console.log(path.eta[path.eta.length-1] , path.eta[0], path.eta.length)
        const options = { use: L.polyline, delay: 8000, dashArray: [10,10], weight: 5, color: colori[indiceCasuale], pulseColor: "#FFFFFF" };
        const pathItem = antPath(pathLatLng, options);
        pathItem.bindTooltip(`<strong><em>Name:</strong> ${path.name}<br /><strong>Eta:</strong> ${eta.getMinutes()}'${eta.getSeconds()}"`, 
            {sticky: true, attribution: "oppp", className: "text-left"}).openTooltip();
        map.addLayer(pathItem);  
        
        return () => {
            map.removeLayer(pathItem)
        }

    })
    
    return null
}
/*
{
    name: id,
    type: "path",
    path: [[lat, lon]],
    eta: [eta] 
}
*/