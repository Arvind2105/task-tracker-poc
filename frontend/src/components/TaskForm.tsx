import React, { useState } from 'react';
import API from '../services/api';
import './TaskForm.css';

interface TaskFormProps {
  onTaskAdded: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>Add New Task</h3>
      <div className="task-form-field">
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="task-input"
        />
      </div>
      <div className="task-form-field">
        <textarea
          placeholder="Task description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="task-textarea"
        />
      </div>
      <button type="submit" className="task-submit-btn">
        Add Task
      </button>
    </form>
  );
};
