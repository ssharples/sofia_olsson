import React, { useState, useEffect } from 'react';
import { useArtStore } from '../store/artStore';
import { supabase } from '../lib/supabase';
import { ArtworkGrid } from '../components/ArtworkGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../lib/auth';
import { AuthModal } from '../components/AuthModal';
import { SubscriptionOffer } from '../components/SubscriptionOffer';
import { AccountMenu } from '../components/AccountMenu';
export function Gallery() {
  const { artworks, isLoading, setArtworks, setLoading } = useArtStore();
  const [error, setError] = React.useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user, subscription } = useAuth();
  const [purchasedImages, setPurchasedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch images from Supabase
        const { data: images, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Create artworks data structure
        const artworksData = images.map((image) => ({
          id: image.id,
          image_url: image.original_url,
          blurred_url: image.blurred_url,
          title: image.id,
          description: '',
          created_at: image.created_at,
          price: image.price
        }));

        setArtworks(artworksData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setArtworks, setLoading]);

  // Check if user has purchased an image
  const hasPurchasedImage = (imageId: string) => {
    return purchasedImages.has(imageId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-[0.015] pointer-events-none" />

      <header className="relative container mx-auto px-4 py-8 flex flex-col items-center text-center">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 mb-8 shadow-xl w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Gallery</h1>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        {/* Account Menu */}
        <div className="fixed top-4 right-4 z-50 md:top-6 md:right-6">
          <AccountMenu
            onShowAuth={() => setShowAuthModal(true)}
            onShowSubscription={() => setShowSubscriptionModal(true)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-lg bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl my-4">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : (
          /* Artwork Grid */
          artworks && (
            <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 md:p-6">
          <ArtworkGrid 
            artworks={artworks}
            imageUrls={Object.fromEntries(
              artworks.map(artwork => [
                artwork.id, 
                {
                  original: artwork.image_url,
                  blurred: artwork.blurred_url || ''
                }
              ])
            )}
            hasPurchasedImage={hasPurchasedImage}
          />
            </div>
          )
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          if (showSubscriptionModal) {
            setShowSubscriptionModal(true);
          }
        }}
      />

      {/* Subscription Modal */}
      <SubscriptionOffer
        show={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}
