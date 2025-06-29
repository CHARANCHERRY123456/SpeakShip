import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, label, onAddressChange }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      // Reverse geocode
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
          onAddressChange(data.display_name || `${e.latlng.lat}, ${e.latlng.lng}`);
        });
    },
  });

  return position ? <Marker position={position} /> : null;
}

const MapAddressPicker = ({
  pickupPosition,
  setPickupPosition,
  dropoffPosition,
  setDropoffPosition,
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
}) => {
  const [selecting, setSelecting] = useState('pickup');

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <button
          className={`px-4 py-2 rounded font-semibold ${selecting === 'pickup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setSelecting('pickup')}
          type="button"
        >
          Select Pickup
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${selecting === 'dropoff' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setSelecting('dropoff')}
          type="button"
        >
          Select Drop-off
        </button>
      </div>
      <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden border border-gray-300">
        <MapContainer center={[17.385, 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selecting === 'pickup' ? (
            <LocationMarker
              position={pickupPosition}
              setPosition={latlng => {
                setPickupPosition(latlng);
                setPickupAddress('Fetching address...');
              }}
              label="Pickup"
              onAddressChange={setPickupAddress}
            />
          ) : (
            <LocationMarker
              position={dropoffPosition}
              setPosition={latlng => {
                setDropoffPosition(latlng);
                setDropoffAddress('Fetching address...');
              }}
              label="Drop-off"
              onAddressChange={setDropoffAddress}
            />
          )}
          {pickupPosition && <Marker position={pickupPosition} />}
          {dropoffPosition && <Marker position={dropoffPosition} />}
        </MapContainer>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mt-2">
        <div className="flex-1 bg-gray-50 rounded p-2 border">
          <div className="font-semibold text-xs text-gray-600 mb-1">Pickup Address</div>
          <div className="text-sm text-gray-800 break-words min-h-[32px]">{pickupAddress || 'Not selected'}</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded p-2 border">
          <div className="font-semibold text-xs text-gray-600 mb-1">Drop-off Address</div>
          <div className="text-sm text-gray-800 break-words min-h-[32px]">{dropoffAddress || 'Not selected'}</div>
        </div>
      </div>
    </div>
  );
};

export default MapAddressPicker;
