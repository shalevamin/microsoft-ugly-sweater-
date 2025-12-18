import React from 'react';
import RetroWindow from './RetroWindow';
import RetroButton from './RetroButton';
import { AlertCircle } from 'lucide-react';

const RetroPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-80 h-auto">
        <RetroWindow title="Microsoft Fashion Critic" onClose={onClose}>
          <div className="p-4 flex flex-col items-center gap-4 bg-win95-bg">
            <div className="flex items-start gap-4">
               <AlertCircle size={32} className="text-red-600 mt-1 flex-shrink-0" />
               <p className="font-pixel text-sm">{message}</p>
            </div>
            <RetroButton onClick={onClose} className="px-6 mt-2">OK</RetroButton>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
};

export default RetroPopup;
