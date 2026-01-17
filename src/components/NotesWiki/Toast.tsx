import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import './toastAnimations.css';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  variant?: 'default' | 'delete';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ 
  message, 
  type = 'success', 
  variant = 'default',
  duration = 3000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const getStyles = () => {
    // Delete variant - Blue style
    if (variant === 'delete') {
      return {
        bg: 'bg-white',
        border: 'border-l-4 border-blue-500',
        icon: 'text-blue-600',
        text: 'text-blue-700',
        wave: '#4777ff3a',
        waveBg: '#4777ff48',
      };
    }

    // Default variants by type
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-green-500',
          icon: 'text-green-500',
          text: 'text-green-700',
          wave: '#04e4003a',
          waveBg: '#04e40048',
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-red-500',
          icon: 'text-red-500',
          text: 'text-red-700',
          wave: '#ff00003a',
          waveBg: '#ff000048',
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-l-4 border-blue-500',
          icon: 'text-blue-500',
          text: 'text-blue-700',
          wave: '#0084ff3a',
          waveBg: '#0084ff48',
        };
    }
  };

  const styles = getStyles();

  const toast = (
    <div
      className={`toast-card ${styles.bg} ${styles.border} ${isClosing ? 'toast-exit' : 'toast-enter'}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        className="toast-wave"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: styles.wave }}
      >
        <path d="M0,64L120,80C240,96,480,128,720,128C960,128,1200,96,1320,80L1440,64L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" />
      </svg>

      <div className="toast-icon-container" style={{ backgroundColor: styles.waveBg }}>
        {type === 'success' && <CheckCircle className={`toast-icon ${styles.icon}`} />}
        {type === 'error' && <AlertCircle className={`toast-icon ${styles.icon}`} />}
        {type === 'info' && <Info className={`toast-icon ${styles.icon}`} />}
      </div>

      <div className="toast-message-container">
        <p className={`toast-message ${styles.text}`}>{message}</p>
      </div>

      <button
        onClick={handleClose}
        className="toast-close-btn text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return createPortal(toast, document.body);
}
