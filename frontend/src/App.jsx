import { useState, useEffect } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

const API = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setTodos)
      .catch(() => setError('Failed to load todos. Is the backend running?'));
  }, []);

  const handleAdd = async (title) => {
    setError('');
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) { setError('Failed to add todo.'); return; }
    const todo = await res.json();
    setTodos((prev) => [todo, ...prev]);
  };

  const handleToggle = async (id, completed) => {
    setError('');
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) { setError('Failed to update todo.'); return; }
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleEdit = async (id, title) => {
    setError('');
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) { setError('Failed to update todo.'); return; }
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id) => {
    setError('');
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) { setError('Failed to delete todo.'); return; }
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <h1>Todo Manager</h1>
      {error && <div className="error">{error}</div>}
      <AddTodo onAdd={handleAdd} />
      <div className="filters">
        {['all', 'active', 'completed'].map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <TodoList
        todos={todos}
        filter={filter}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <p className="stats">
        {activeCount} remaining &bull; {completedCount} completed
      </p>
    </div>
  );
}
