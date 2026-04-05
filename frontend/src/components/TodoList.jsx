import TodoItem from './TodoItem';

export default function TodoList({ todos, filter, onToggle, onEdit, onDelete }) {
  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    return <p className="empty">No tasks here.</p>;
  }

  return (
    <div className="todo-list">
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
