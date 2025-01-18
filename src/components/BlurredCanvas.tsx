import React, { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface BlurredCanvasProps {
  imageUrl: string;
  blurAmount: number;
  className?: string;
}

export const BlurredCanvas: React.FC<BlurredCanvasProps> = ({ 
  imageUrl, 
  blurAmount,
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    
    const loadImage = async () => {
      try {
        // Use Supabase storage URL directly
        const { data: { publicUrl } } = await supabase
          .storage
          .from('artworks')
          .getPublicUrl(imageUrl);
        
        img.crossOrigin = 'anonymous';
        img.src = publicUrl;

        img.onload = () => {
          try {
            // Set canvas dimensions while maintaining aspect ratio
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            // Draw image with blur
            ctx.filter = `blur(${blurAmount}px)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Disable right click
            canvas.oncontextmenu = (e: MouseEvent) => e.preventDefault();
          } catch (error) {
            console.error('Error drawing image:', error);
            // Fallback to showing a placeholder
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        };

        img.onerror = (error: Event | string) => {
          console.error('Error loading image:', error);
          // Show error state
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, canvas.width || 500, canvas.height || 500);
          ctx.fillStyle = '#000';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Failed to load image', (canvas.width || 500)/2, (canvas.height || 500)/2);
        };
      } catch (error) {
        console.error('Error getting public URL:', error);
      }
    };

    loadImage();

    return () => {
      // Cleanup
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, blurAmount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    />
  );
};
