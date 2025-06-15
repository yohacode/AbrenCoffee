import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title = 'Confirm Action',
    message = 'Are you sure?',
    onConfirm,
    onCancel,
    isOpen,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="confirm-modal-backdrop">
        <div className="confirm-modal">
          <h2>{title}</h2>
          <p>{message}</p>
          <div className="button-group">
            <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            <button className="confirm-btn" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    );
  };

export default ConfirmModal;
