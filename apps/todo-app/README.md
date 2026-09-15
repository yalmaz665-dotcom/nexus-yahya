# Todo App - Nexus Yahya

A modern, feature-rich todo list application built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

✨ **Key Features:**
- ✅ Add, complete, and delete tasks
- 💾 Automatic local storage persistence
- 📊 Real-time task statistics (total, completed, remaining)
- 🎨 Beautiful, responsive UI with gradient design
- ⚡ Fast and lightweight
- 🔄 Instant updates without page refresh
- 📱 Mobile-friendly design

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **UI Components:** React 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Storage:** Browser LocalStorage API

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd apps/todo-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
apps/todo-app/
├── app/
│   ├── page.tsx          # Main todo app component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── Todo/
│       ├── TodoItem.tsx  # Individual todo item component
│       ├── TodoInput.tsx # Input form component
│       ├── TodoList.tsx  # Todo list container
│       └── index.ts      # Exports
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Usage

1. **Add a Task:** Type in the input field and click "Add" or press Enter
2. **Complete a Task:** Click the circle icon next to a task to mark it complete
3. **Delete a Task:** Hover over a task and click the trash icon
4. **Clear Completed:** Use the "Clear completed tasks" button in the footer
5. **Persistent Storage:** Your tasks are automatically saved to browser storage

## Data Structure

Tasks are stored in localStorage with the following structure:

```typescript
interface Todo {
  id: string;              // Unique identifier (timestamp)
  title: string;           // Task description
  completed: boolean;      // Completion status
  createdAt: number;       // Creation timestamp
}
```

## Features in Detail

### Local Storage Persistence
- Automatically saves all tasks to browser's localStorage
- Loads tasks on app initialization
- No backend required

### Task Statistics
- Display total number of tasks
- Show number of completed tasks
- Calculate remaining tasks
- Real-time updates

### UI/UX
- Gradient header with branding
- Responsive grid layout for statistics
- Hover effects and transitions
- Empty state messaging
- Visual feedback for completed tasks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Author

Made with ❤️ by **Yahya Almaz** for **Nexus Yahya**
