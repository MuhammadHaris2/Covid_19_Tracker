import React from 'react';
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from './helper';
//  import { Map as LeafletMap, TileLayer } from "leaflet";
import './MapsCom.css'



const MapsCom = ({countries,casesType, center, zoom }) => {

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    return (
        <div className="map">

            <MapContainer center={center} zoom={zoom}>


                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                {showDataOnMap(countries,casesType)}
            </MapContainer>

        </div>
    )
}

export default MapsCom;
