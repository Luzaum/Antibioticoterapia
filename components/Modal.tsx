import React from 'react';
import Icon from './Icon';

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 animate-fade-in" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      aria-label={title || 'Detalhes'}
    >
      <div 
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">{title || 'Detalhes'}</h3>
          <button 
            className="text-slate-500 hover:text-slate-700" 
            onClick={onClose} 
            aria-label="Fechar"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="text-slate-700 whitespace-pre-line leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default Modal;