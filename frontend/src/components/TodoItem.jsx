import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleSave = () => {
    if (!editValue.trim()) return;
    onEdit(todo.id, editValue.trim());
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(todo.title);
      setEditing(false);
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
      />
      {editing ? (
        <input
          className="edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className={`title${todo.completed ? ' completed' : ''}`}>{todo.title}</span>
      )}
      <div className="actions">
        {editing ? (
          <>
            <button className="btn-save" onClick={handleSave}>Save</button>
            <button className="btn-cancel" onClick={() => { setEditValue(todo.title); setEditing(false); }}>Cancel</button>
          </>
        ) : (
          <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="btn-delete" onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </div>
  );
}
