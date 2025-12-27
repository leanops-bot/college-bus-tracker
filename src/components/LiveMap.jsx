import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to center map on bus move
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
};

const LiveMap = ({ busId }) => {
    const [position, setPosition] = useState(null);
    const db = getDatabase(app);

    useEffect(() => {
        if (!busId) return;

        const locRef = ref(db, `/buses/${busId}/liveLocation`);
        const unsubscribe = onValue(locRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPosition([data.latitude, data.longitude]);
            }
        });

        return () => unsubscribe();
    }, [busId]);

    if (!position) {
        return (
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>
                <p>Waiting for live location signal...</p>
            </div>
        );
    }

    return (
        <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    <b>{busId}</b> <br /> Live Location
                </Popup>
            </Marker>
            <RecenterMap lat={position[0]} lng={position[1]} />
        </MapContainer>
    );
};

export default LiveMap;
