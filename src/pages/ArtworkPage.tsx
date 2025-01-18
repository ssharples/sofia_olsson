import React from 'react';
import { useParams } from 'react-router-dom';
import { useArtStore } from '../store/artStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { BlurredCanvas } from '../components/BlurredCanvas';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? '');

interface PaymentFormProps {
  clientSecret: string;
  artwork: {
    id: string;
    title: string;
    price: number;
  };
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  artwork,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      } else {
        throw new Error('Payment failed or was cancelled');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
      onError(error instanceof Error ? error : new Error('Payment failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement
        options={{
          paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
          layout: 'tabs',
        }}
      />
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg 
                 font-medium shadow-md hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <span>Processing...</span>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Unblur me</span>
          </>
        )}
      </button>
    </form>
  );
};

export function ArtworkPage() {
  const { id } = useParams();
  const { artwork, isLoading, setArtwork, setLoading } = useArtStore();
  const { user, subscription } = useAuth();
  const [blurredImageUrl, setBlurredImageUrl] = React.useState<string | undefined>();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [showPayment, setShowPayment] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

        if (data?.image_url) {
          const response = await supabase.functions.invoke('generate-blurred-image', {
            body: { imageUrl: data.image_url }
          });
          const blurredUrl = response.data?.blurredUrl ?? undefined;
          if (blurredUrl) {
            setBlurredImageUrl(blurredUrl);
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

  const handlePurchaseClick = async () => {
    if (!artwork) return;

    try {
      const { data, error: paymentError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            artworkId: artwork.id,
            price: artwork.price,
            type: 'payment_element',
          },
        }
      );

      if (paymentError) throw new Error(paymentError.message || 'Failed to create payment');
      if (!data?.clientSecret) throw new Error('Invalid response from server');

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const handlePaymentSuccess = () => {
    if (artwork) {
      const artStore = useArtStore.getState();
      artStore.addPurchasedArtwork(artwork.id);
    }
    setShowPayment(false);
  };

  const handlePaymentError = (error: Error) => {
    setError(error.message);
    setShowPayment(false);
  };

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
          <meta property="og:description" content={artwork.description || ''} />
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
              <div 
                className="relative"
                onContextMenu={(e) => e.preventDefault()}
              >
                <div className="relative aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100">
                  {artwork.isBlurred && !(user && subscription) ? (
                    <BlurredCanvas 
                      imageUrl={artwork.image_url}
                      blurAmount={20}
                      className="w-full h-full"
                    />
                  ) : (
                    <img 
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                      style={{
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                      }}
                    />
                  )}
                </div>
                {artwork.isBlurred && !(user && subscription) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-4">
                    <Lock className="w-8 h-8 text-white mb-4" />
                    <div className="w-full max-w-md">
                      {showPayment && clientSecret ? (
                        <Elements
                          stripe={stripePromise}
                          options={{
                            clientSecret,
                            appearance: {
                              theme: 'stripe',
                              variables: {
                                colorPrimary: '#000000',
                                colorBackground: '#ffffff',
                                colorText: '#000000',
                                colorDanger: '#df1b41',
                                fontFamily: 'system-ui, sans-serif',
                                spacingUnit: '4px',
                                borderRadius: '8px',
                              },
                            },
                          }}
                        >
                          <PaymentForm
                            clientSecret={clientSecret}
                            artwork={{
                              id: artwork.id,
                              title: artwork.title,
                              price: artwork.price
                            }}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                        </Elements>
                      ) : (
                        <button
                          onClick={handlePurchaseClick}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg 
                                   font-medium shadow-md hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                        >
                          <Lock className="w-5 h-5" />
                          <span>Unblur me</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
              <p className="text-gray-300">{artwork.description}</p>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}
