import React from 'react';
import { ArtworkCard } from './ArtworkCard';
import type { Artwork, ImageUrls } from '../types';

interface ArtworkGridProps {
  artworks: Artwork[];
  imageUrls: Record<string, ImageUrls>;
  hasPurchasedImage: (imageId: string) => boolean;
}

export function ArtworkGrid({ artworks, imageUrls }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="aspect-square w-full">
          <ArtworkCard 
            artwork={artwork}
            imageUrls={imageUrls[artwork.id]}
          />
        </div>
      ))}
    </div>
  );
}
