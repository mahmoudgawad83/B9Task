# Todo Manager

A full-stack todo application built with React (frontend) and Node.js/Express + SQLite (backend).

## Project Structure

```
B9Task/
├── backend/          # Express REST API
│   ├── server.js
│   ├── database.js
│   └── package.json
└── frontend/         # React + Vite app
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── components/
    │       ├── AddTodo.jsx
    │       ├── TodoItem.jsx
    │       └── TodoList.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm start
# Runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## API Endpoints

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | /api/todos        | List all todos     |
| POST   | /api/todos        | Create a todo      |
| PUT    | /api/todos/:id    | Update a todo      |
| DELETE | /api/todos/:id    | Delete a todo      |

## Features

- Create, read, update, and delete tasks
- Toggle tasks complete/incomplete
- Inline editing
- Filter by All / Active / Completed
- Persistent SQLite storage
