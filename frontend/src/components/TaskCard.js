import React from 'react';

export default function TaskCard({ task, onEdit, onComplete, onDelete }) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'COMPLETED';
  const isCompleted = task.status === 'COMPLETED';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCreated = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`task-card priority-${task.priority} ${isCompleted ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-title-area">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
        </div>
        <div className="task-badges">
          <span className={`badge badge-priority-${task.priority}`}>
            {task.priority === 'HIGH' ? '🔥' : task.priority === 'MEDIUM' ? '⚡' : '🌿'} {task.priority}
          </span>
          <span className={`badge badge-status-${task.status}`}>
            {task.status === 'COMPLETED' ? '✅' : task.status === 'IN_PROGRESS' ? '🔄' : '⏳'}{' '}
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="task-footer">
        <div className="task-meta">
          {task.deadline && (
            <span className={isOverdue ? 'deadline-overdue' : ''}>
              📅 {isOverdue ? '⚠️ Overdue · ' : ''}{formatDate(task.deadline)}
            </span>
          )}
          <span>🕐 {formatCreated(task.createdAt)}</span>
        </div>

        <div className="task-actions">
          {!isCompleted && (
            <button
              id={`complete-task-${task.id}`}
              className="btn btn-success btn-sm"
              onClick={() => onComplete(task.id)}
              title="Mark as complete"
            >
              ✓ Done
            </button>
          )}
          <button
            id={`edit-task-${task.id}`}
            className="btn btn-warning btn-sm"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️ Edit
          </button>
          <button
            id={`delete-task-${task.id}`}
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(task)}
            title="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
