import { Trash2, CheckCircle2, Circle } from 'lucide-react';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
      <button
        onClick={() => onToggle(id)}
        className="flex-shrink-0 text-indigo-600 hover:text-indigo-700 transition"
      >
        {completed ? (
          <CheckCircle2 size={24} className="fill-current" />
        ) : (
          <Circle size={24} />
        )}
      </button>
      <span
        className={`flex-1 text-lg ${
          completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {title}
      </span>
      <button
        onClick={() => onDelete(id)}
        className="flex-shrink-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
