import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MiniMapProps {
  latitude: number;
  longitude: number;
  schoolName: string;
  municipio: string;
}

export function MiniMap({ latitude, longitude, schoolName, municipio }: MiniMapProps) {
  // Check if coordinates are valid
  if (!latitude || !longitude || latitude === 0 || longitude === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Coordenadas não disponíveis</p>
      </div>
    );
  }

  // OpenStreetMap embed URL with zoom level 15
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005}%2C${latitude - 0.003}%2C${longitude + 0.005}%2C${latitude + 0.003}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  
  // Google Maps URL for opening in new tab
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border relative group">
      <iframe
        title={`Localização de ${schoolName}`}
        src={mapUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Overlay button to open in Google Maps */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-md text-xs gap-1"
          onClick={() => window.open(googleMapsUrl, '_blank')}
        >
          <ExternalLink className="h-3 w-3" />
          Abrir mapa
        </Button>
      </div>
      
      {/* Location label - positioned to avoid zoom controls */}
      <div className="absolute bottom-2 left-2 bg-background/90 px-2 py-1 rounded text-xs font-medium shadow-sm">
        📍 {municipio}, PI
      </div>
    </div>
  );
}
