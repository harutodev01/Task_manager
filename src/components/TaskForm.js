import React, { useState } from 'react';

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function TaskForm({ onSubmit, onCancel, initialData, isEdit }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'PENDING',
    priority: initialData?.priority || 'MEDIUM',
    deadline: initialData?.deadline || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Title <span>*</span></label>
          <input
            id="task-title"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            autoFocus
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            id="task-description"
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add more details (optional)..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select id="task-priority" className="form-control" name="priority" value={form.priority} onChange={handleChange}>
              {PRIORITY_OPTIONS.map(p => (
                <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select id="task-status" className="form-control" name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input
            id="task-deadline"
            className="form-control"
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button id="cancel-task-btn" type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button id="submit-task-btn" type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Saving...' : isEdit ? '✏️ Update Task' : '✨ Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
}
