import React from 'react';
import { useParams } from 'react-router-dom';
import { useArtStore } from '../store/artStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export function ArtworkPage() {
  const { id } = useParams();
  const { artwork, isLoading, setArtwork, setLoading } = useArtStore();
  const { user, subscription } = useAuth();
  const [blurredImageUrl, setBlurredImageUrl] = React.useState<string | undefined>();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('artworks')
          .select('*')
          .eq('id', id)
          .single();
        
        setArtwork(data);

        // Generate blurred preview image
        if (data?.imageUrl) {
          const response = await supabase.functions.invoke('generate-blurred-image', {
            body: { imageUrl: data.imageUrl }
          });
          const blurredUrl = response.data?.blurredUrl;
          if (blurredUrl && typeof blurredUrl === 'string') {
            setBlurredImageUrl(blurredUrl);
          } else {
            setBlurredImageUrl(undefined);
          }
        }
      } catch (err) {
        console.error('Failed to load artwork:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setArtwork, setLoading]);

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
          <title>{artwork.title} - Eva Cobero Art</title>
          <meta property="og:title" content={`${artwork.title} - Eva Cobero Art`} />
          <meta property="og:description" content={artwork.description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={window.location.href} />
          {blurredImageUrl && (
            <>
              <meta property="og:image" content={blurredImageUrl} />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:image" content={blurredImageUrl} />
            </>
          )}
          <meta property="og:site_name" content="Eva Cobero Art" />
          <meta property="og:locale" content="en_US" />
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6">
              <img 
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-auto rounded-lg mb-6"
                style={{
                  filter: user && subscription ? 'none' : 'blur(20px)',
                  transition: 'filter 0.3s ease'
                }}
              />
              <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
              <p className="text-gray-300">{artwork.description}</p>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
