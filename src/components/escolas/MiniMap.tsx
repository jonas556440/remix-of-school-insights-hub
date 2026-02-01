import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  latitude: number;
  longitude: number;
  schoolName: string;
  municipio: string;
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function MiniMap({ latitude, longitude, schoolName, municipio }: MiniMapProps) {
  // Check if coordinates are valid
  if (!latitude || !longitude || latitude === 0 || longitude === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Coordenadas não disponíveis</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{schoolName}</p>
              <p className="text-muted-foreground">{municipio}, PI</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
