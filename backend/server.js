const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all todos
app.get('/api/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
  res.json(todos.map(t => ({ ...t, completed: t.completed === 1 })));
});

// POST create a todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title.trim());
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...todo, completed: todo.completed === 1 });
});

// PUT update a todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const newTitle = title !== undefined ? title.trim() : todo.title;
  const newCompleted = completed !== undefined ? (completed ? 1 : 0) : todo.completed;

  if (!newTitle) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?').run(newTitle, newCompleted, id);
  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json({ ...updated, completed: updated.completed === 1 });
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
