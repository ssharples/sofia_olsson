import React, { useEffect, useRef } from 'react';

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
    // Handle mobile-specific CORS issues
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    img.crossOrigin = isMobile ? 'use-credentials' : 'anonymous';
    
    // Add timestamp cache buster for mobile
    const url = new URL(imageUrl);
    if (isMobile) {
      url.searchParams.set('t', Date.now().toString());
    }
    img.src = url.toString();

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
        canvas.oncontextmenu = (e) => e.preventDefault();
      } catch (error) {
        console.error('Error drawing image:', error);
        // Fallback to showing a placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
      if (ctx) {
        // Show error state
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width || 500, canvas.height || 500);
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Failed to load image', (canvas.width || 500)/2, (canvas.height || 500)/2);
      }
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
