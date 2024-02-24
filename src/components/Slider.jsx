import  './leaflet-slider/dist/leaflet-slider.js';
import  './leaflet-slider/dist/leaflet-slider.css';
import { useMap } from 'react-leaflet/hooks';
import L from "leaflet"
import { useEffect } from 'react';

const Slider = ( {setOpacity, opacity}) => {
    const container = useMap();

	useEffect(()=> {

		const slider = L.control.slider(function(value) {
			// I have two layers whose opacity I have to vary
			setOpacity(value)
			console.log(value);
		}, { // slider options
			orientation:'vertical', 
			id: 'slider',
			step: 0.1,
			size: '100px',
			min: 0, max: 1,
			value: opacity,
			//logo: 's',
			collapsed: false,
			title: 'Set Opacity',
			syncSlider: true,
			increment: true
		}).addTo(container);
		
		return () => {
			slider.remove()
		}
	}) // ~ useEffect
    return null;
}

export default Slider;