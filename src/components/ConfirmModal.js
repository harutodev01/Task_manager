import React from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, taskTitle }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '420px' }}>
        <div className="confirm-body">
          <div className="confirm-icon">🗑️</div>
          <h2 className="modal-title" style={{ marginBottom: '0.75rem' }}>Delete Task?</h2>
          <p className="confirm-text">
            Are you sure you want to delete <strong>"{taskTitle}"</strong>?
            <br />This action cannot be undone.
          </p>
          <div className="confirm-actions">
            <button id="confirm-cancel-btn" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="confirm-delete-btn" className="btn btn-danger" onClick={onConfirm}>Delete Task</button>
          </div>
        </div>
      </div>
    </div>
  );
}
