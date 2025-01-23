import React from 'react';
import { motion } from 'framer-motion';

interface UpsellModalProps {
  price: number;
  title: string;
  onClose: () => void;
  onSelect: (choice: 'single' | 'multi') => void;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ 
  price,
  title,
  onClose,
  onSelect
}) => {
  const multiPrice = price * 5 * 0.25; // 5 images at 75% discount
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-4">Unlock {title}</h3>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Special Offers</h4>
            <button
              onClick={() => onSelect('multi')}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mb-4"
            >
              Get 5 Images - £{multiPrice.toFixed(2)} (75% OFF!)
            </button>
            <button
              onClick={() => onSelect('single')}
              className="w-full py-3 rounded-lg border-2 border-black hover:bg-gray-100 transition-colors"
            >
              Just This One - £{price.toFixed(2)}
            </button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">Lifetime Access</h4>
            <p className="text-gray-600 mb-4">
              Unlock all current and future artworks for just $69
            </p>
            <button
              onClick={() => {
                onSelect('multi');
                onClose();
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Lifetime Access - $69
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
