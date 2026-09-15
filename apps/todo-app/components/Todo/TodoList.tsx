import { TodoItem } from './TodoItem';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-lg">No tasks yet. Add one to get started! 🚀</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
