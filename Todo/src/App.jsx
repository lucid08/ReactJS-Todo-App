import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputText, setInputText] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmedText = inputText.trim();
    if (!trimmedText) return;
    
    setTodos([...todos, {
      id: Date.now(),
      text: trimmedText,
      completed: false
    }]);
    setInputText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;
    
    setTodos(todos.map(todo => 
      todo.id === editId ? { ...todo, text: trimmedText } : todo
    ));
    setEditId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'completed') return todo.completed;
    if (currentFilter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Todo App</h1>
      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCurrentFilter('all')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            currentFilter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setCurrentFilter('completed')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            currentFilter === 'completed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setCurrentFilter('pending')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            currentFilter === 'pending' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Pending
        </button>
      </div>
      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <div 
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              {editId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.text}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 ml-3">
              {editId === todo.id ? (
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditId(todo.id);
                    setEditText(todo.text);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;