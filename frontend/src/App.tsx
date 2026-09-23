import { useState, useEffect } from 'react';
import API from './services/api';
import { Auth } from './components/Auth';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import type { Task } from './components/TaskList';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Check auth status on load
  const checkAuthStatus = async () => {
    try {
      await API.get('/auth/status');
      setIsAuthenticated(true);
      fetchTasks();
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      setIsAuthenticated(false);
      setTasks([]);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '0 20px',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #ccc',
          paddingBottom: '10px',
        }}
      >
        <h2>Task Tracker POC</h2>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Logout
          </button>
        )}
      </header>

      <main style={{ marginTop: '20px' }}>
        {!isAuthenticated ? (
          <Auth
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              fetchTasks();
            }}
          />
        ) : (
          <div>
            <TaskForm onTaskAdded={fetchTasks} />
            <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
          </div>
        )}
      </main>
    </div>
  );
}
