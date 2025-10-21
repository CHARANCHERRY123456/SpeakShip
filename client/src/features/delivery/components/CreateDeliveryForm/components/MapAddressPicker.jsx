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

function LocationMarker({ position, setPosition, label, onAddressChange, setLoading }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLoading(true);
      // Convert coordinates to human-readable address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
          onAddressChange(data.display_name || `${e.latlng.lat}, ${e.latlng.lng}`);
        })
        .finally(() => setLoading(false));
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
  const [pickupLoading, setPickupLoading] = useState(false);
  const [dropoffLoading, setDropoffLoading] = useState(false);

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
                // Do not setPickupAddress('Fetching address...')
              }}
              label="Pickup"
              onAddressChange={setPickupAddress}
              setLoading={setPickupLoading}
            />
          ) : (
            <LocationMarker
              position={dropoffPosition}
              setPosition={latlng => {
                setDropoffPosition(latlng);
                // Do not setDropoffAddress('Fetching address...')
              }}
              label="Drop-off"
              onAddressChange={setDropoffAddress}
              setLoading={setDropoffLoading}
            />
          )}
          {pickupPosition && <Marker position={pickupPosition} />}
          {dropoffPosition && <Marker position={dropoffPosition} />}
        </MapContainer>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mt-2">
        <div className="flex-1 bg-gray-50 rounded p-2 border">
          <div className="font-semibold text-xs text-gray-600 mb-1">Pickup Address</div>
          <div className="text-sm text-gray-800 break-words min-h-[32px]">
            {pickupLoading ? <span className="text-xs text-blue-500">Fetching address...</span> : (pickupAddress || 'Not selected')}
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded p-2 border">
          <div className="font-semibold text-xs text-gray-600 mb-1">Drop-off Address</div>
          <div className="text-sm text-gray-800 break-words min-h-[32px]">
            {dropoffLoading ? <span className="text-xs text-blue-500">Fetching address...</span> : (dropoffAddress || 'Not selected')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapAddressPicker;
