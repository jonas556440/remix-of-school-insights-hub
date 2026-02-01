import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, X, ZoomIn, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  isLoading?: boolean;
}

export function PhotoGallery({ photos, isLoading = false }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  const handleImageLoad = (id: string) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando fotos...</span>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <ZoomIn className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">
          Nenhuma foto disponível para esta escola
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Photo count and source */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {photos.length} foto{photos.length !== 1 ? "s" : ""} disponíve{photos.length !== 1 ? "is" : "l"}
        </p>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          📁 Fonte: UGERF
        </span>
      </div>

      {/* Grid Gallery */}
      <ScrollArea className="h-[400px] pr-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => openLightbox(index)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden",
                "bg-muted border border-border",
                "hover:ring-2 hover:ring-primary hover:ring-offset-2",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "transition-all duration-200 group"
              )}
            >
              {!imageLoaded[photo.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
              <img
                src={photo.url}
                alt={`Foto ${index + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(photo.id)}
                className={cn(
                  "w-full h-full object-cover",
                  "transition-transform duration-200 group-hover:scale-105",
                  !imageLoaded[photo.id] && "opacity-0"
                )}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 h-10 w-10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </div>

            {/* Previous button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Current image */}
            <img
              src={photos[currentIndex]?.url}
              alt={`Foto ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
            />

            {/* Next button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
              <div className="flex gap-1.5 bg-black/50 p-2 rounded-lg max-w-[80vw] overflow-x-auto">
                {photos.slice(
                  Math.max(0, currentIndex - 4),
                  Math.min(photos.length, currentIndex + 5)
                ).map((photo, idx) => {
                  const actualIndex = Math.max(0, currentIndex - 4) + idx;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentIndex(actualIndex)}
                      className={cn(
                        "w-12 h-12 rounded overflow-hidden flex-shrink-0 transition-all",
                        actualIndex === currentIndex
                          ? "ring-2 ring-white scale-110"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={photo.url}
                        alt={`Miniatura ${actualIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
