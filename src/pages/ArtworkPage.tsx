import React from 'react';
import { useParams } from 'react-router-dom';
import { useArtStore } from '../store/artStore';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Lock } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '');

export default function ArtworkPage() {
  const { id } = useParams();
  const { artwork, isLoading } = useArtStore();
  const { user, subscription } = useAuth();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    // Fetch artwork data and generate blurred preview
    const fetchArtwork = async () => {
      try {
        const { data } = await supabase
          .from('artworks')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          useArtStore.setState({ artwork: data });
          
          // Generate blurred preview if it doesn't exist
          if (!data.blurred_url) {
            await generateBlurredPreview(data.image_url, data.id);
          }
        }
      } catch (error) {
        console.error('Error fetching artwork:', error);
      }
    };

    fetchArtwork();
  }, [id]);

  const generateBlurredPreview = async (imageUrl: string, artworkId: string) => {
    // Call Supabase function to generate blurred image
    const { data } = await supabase.functions.invoke('generate-blurred-image', {
      body: { imageUrl, artworkId }
    });
    
    return data.blurredUrl;
  };

  const handlePurchaseClick = async () => {
    if (!artwork) return;

    try {
      const { data } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          artworkId: artwork.id,
          price: artwork.price,
          type: 'payment_element'
        }
      });

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Helmet>
          <title>{artwork.title} - Sofia Olsson Art</title>
          <meta property="og:title" content={`${artwork.title} - Sofia Olsson Art`} />
          <meta property="og:description" content={artwork.description || ''} />
          <meta property="og:image" content={artwork.blurred_url} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
              <img
                src={artwork.blurred_url}
                alt={artwork.title}
                className={`w-full h-full object-cover ${
                  artwork.isBlurred && !(user && subscription) ? 'blur-lg' : ''
                }`}
              />

              {artwork.isBlurred && !(user && subscription) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4">
                  <Lock className="w-8 h-8 text-white mb-4" />
                  {clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <PaymentForm 
                        onSuccess={() => {
                          // Handle successful payment
                          useArtStore.setState({ 
                            purchasedArtworks: [
                              ...useArtStore.getState().purchasedArtworks,
                              artwork.id
                            ]
                          });
                        }}
                      />
                    </Elements>
                  ) : (
                    <button
                      onClick={handlePurchaseClick}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Unblur Me
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8">
              <h1 className="text-3xl font-bold">{artwork.title}</h1>
              <p className="mt-4 text-gray-300">{artwork.description}</p>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
