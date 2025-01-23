import React from 'react';
import { motion } from 'framer-motion';

interface UpsellModalProps {
  onAccept: (offerType: 'multi'|'lifetime') => void;
  onDecline: () => void;
  currentPrice: number;
  isOpen: boolean;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ 
  onAccept,
  onDecline,
  currentPrice
}) => {
  const discountPrice = currentPrice * 0.25; // 75% discount
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Unlock More Art</h3>
        <p className="text-gray-600 mb-6">
          Get 5 additional artworks for just £{(discountPrice * 5).toFixed(2)} 
          (<s>£{(currentPrice * 5).toFixed(2)}</s>)!
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onAccept('multi')}
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add 5 More (+£{(discountPrice * 5).toFixed(2)})
          </button>
          <button
            onClick={onDecline}
            className="py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Continue with Single (£{currentPrice.toFixed(2)})
          </button>
        </div>
      </div>
    </motion.div>
  );
};
