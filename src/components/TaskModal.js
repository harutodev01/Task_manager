import React from 'react';
import TaskForm from './TaskForm';

export default function TaskModal({ isOpen, title, onClose, onSubmit, initialData, isEdit }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button id="modal-close-btn" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <TaskForm
          onSubmit={onSubmit}
          onCancel={onClose}
          initialData={initialData}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
}
