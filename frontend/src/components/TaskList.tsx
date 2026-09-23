import React, { useState } from 'react';
import API from '../services/api';
import './TaskList.css';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleStartEdit = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;

    try {
      await API.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditingId(null);
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/tasks/${id}`);
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (tasks.length === 0) {
    return <p>No tasks found. Add one above!</p>;
  }

  return (
    <div className="task-list-container">
      <h3>Your Tasks</h3>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            {editingId === task._id ? (
              <div style={{ width: '100%' }}>
                <div className="edit-form-field">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                </div>
                <div className="edit-form-field">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-textarea"
                  />
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleSaveEdit(task._id)}
                    className="btn-save"
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className="btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="btn-update"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
