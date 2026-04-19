import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './index.css';
import { taskApi } from './api/taskApi';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import ConfirmModal from './components/ConfirmModal';

const FILTER_TABS = [
  { label: 'All', value: '' },
  { label: '⏳ Pending', value: 'PENDING' },
  { label: '🔄 In Progress', value: 'IN_PROGRESS' },
  { label: '✅ Completed', value: 'COMPLETED' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        taskApi.getAll(activeFilter || undefined),
        taskApi.getStats(),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error('Failed to connect to backend. Is Spring Boot running?');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (form) => {
    try {
      await taskApi.create(form);
      toast.success('Task created successfully! 🎉');
      setShowCreateModal(false);
      fetchTasks();
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (form) => {
    try {
      await taskApi.update(editTask.id, form);
      toast.success('Task updated! ✏️');
      setEditTask(null);
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleComplete = async (id) => {
    try {
      await taskApi.complete(id);
      toast.success('Task marked as complete! ✅');
      fetchTasks();
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await taskApi.delete(deleteTarget.id);
      toast.success('Task deleted');
      setDeleteTarget(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
  });

  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#16161f',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '0.875rem',
          },
        }}
      />

      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <div className="navbar-logo">✅</div>
          <span className="navbar-title">TaskFlow</span>
        </a>
        <div className="navbar-actions">
          <button
            id="navbar-new-task-btn"
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + New Task
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="app-container">

        {/* Hero */}
        <div className="hero-section">
          <h1 className="hero-greeting">Good day! 👋</h1>
          <p className="hero-subtitle">{now} · {stats.pending} pending tasks awaiting your attention</p>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">📋</div>
              <div className="stat-info">
                <div className="stat-value purple">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">⏳</div>
              <div className="stat-info">
                <div className="stat-value amber">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🔄</div>
              <div className="stat-info">
                <div className="stat-value blue">{stats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info">
                <div className="stat-value green">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                id={`filter-${tab.value || 'all'}`}
                className={`filter-tab ${activeFilter === tab.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="filter-search">
            <span className="search-icon">🔍</span>
            <input
              id="search-tasks-input"
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            id="add-task-btn"
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Task
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Loading tasks...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              {searchQuery ? '🔍' : activeFilter ? '📭' : '🚀'}
            </div>
            <h2 className="empty-title">
              {searchQuery ? 'No matching tasks' : activeFilter ? `No ${activeFilter.toLowerCase().replace('_', ' ')} tasks` : 'No tasks yet!'}
            </h2>
            <p className="empty-subtitle">
              {searchQuery
                ? `No tasks match "${searchQuery}". Try a different search.`
                : 'Create your first task and start being productive!'}
            </p>
            {!searchQuery && (
              <button id="empty-add-btn" className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                ✨ Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-container">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditTask}
                onComplete={handleComplete}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <TaskModal
        isOpen={showCreateModal}
        title="✨ Create New Task"
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        isEdit={false}
      />

      {/* Edit Modal */}
      <TaskModal
        isOpen={!!editTask}
        title="✏️ Edit Task"
        onClose={() => setEditTask(null)}
        onSubmit={handleUpdate}
        initialData={editTask}
        isEdit={true}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        taskTitle={deleteTarget?.title}
      />
    </div>
  );
}

export default App;
