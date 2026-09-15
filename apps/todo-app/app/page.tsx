'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import { TodoItem, TodoInput, TodoList } from '@/components/Todo';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error('Failed to parse todos:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const remainingCount = todos.length - completedCount;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
            <p className="text-blue-100">Stay organized and productive</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{todos.length}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{remainingCount}</p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={addTodo} className="p-6 border-b">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </form>

          {/* Todo List */}
          {todos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No tasks yet. Add one to get started! 🚀</p>
            </div>
          ) : (
            <div className="divide-y">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 text-indigo-600 hover:text-indigo-700 transition"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={24} className="fill-current" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-lg ${
                      todo.completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {todos.length > 0 && completedCount > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={clearCompleted}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
              >
                Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
