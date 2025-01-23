import React from 'react';
import { motion } from 'framer-motion';

interface LifetimeOfferProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const LifetimeAccessOffer: React.FC<LifetimeOfferProps> = ({
  onAccept,
  onDecline
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Lifetime Access</h3>
        <p className="text-gray-600 mb-6">
          Unlock all current and future artworks forever for just $69!
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onAccept}
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get Lifetime Access ($69)
          </button>
          <button
            onClick={onDecline}
            className="py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Continue with Single Purchase
          </button>
        </div>
      </div>
    </motion.div>
  );
};
