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
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image with blur
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, 0, 0);

      // Disable right click
      canvas.oncontextmenu = (e) => e.preventDefault();
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
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
