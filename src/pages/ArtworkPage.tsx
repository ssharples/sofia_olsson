import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useArtStore } from '../store/artStore';
import { supabase } from '../lib/supabase';
import { ArtworkCard } from '../components/ArtworkCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ArtworkPage() {
  const { id } = useParams();
  const { artworks, setArtworks, setLoading, isLoading } = useArtStore();
  const artwork = artworks.find(a => a.id === id);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artwork) {
        try {
          setLoading(true);
          const { data } = await supabase
            .from('artworks')
            .select('*')
            .eq('id', id)
            .single();
          
          if (data) {
            setArtworks([data]);
          }
        } catch (error) {
          console.error('Error fetching artwork:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArtwork();
  }, [id, artwork, setArtworks, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Artwork not found</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Helmet>
          <title>{artwork.title} - Sofia's Art</title>
          <meta property="og:title" content={artwork.title} />
          <meta property="og:description" content={`Premium artwork by ${artwork.artist_name || 'the artist'}`} />
          <meta property="og:image" content={artwork.imageUrl} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
        </Helmet>
        
        {/* Background pattern */}
        <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.015] pointer-events-none" />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ArtworkCard artwork={artwork} />
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
}
