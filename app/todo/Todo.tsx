"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Define interface for Todo object
interface Todo {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  assignedTo?: string;
  notes?: string;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todo');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data as Todo[]); 
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
    if (window.confirm('Are you sure you want to delete this todo?')) {
        const response = await fetch(`/api/todo`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // Send just the id
        });
        if (response.ok) {
          // Remove the deleted todo from state
          setTodos(todos.filter(todo => todo.id !== id));
          console.log(`Todo with ID ${id} deleted successfully.`);
        } else {
          console.error('Failed to delete todo:', response.statusText);
        }
    }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }; 

  return (
    <main className="">
      <div>
        <div className="flex justify-around items-center">
          <h1 className='font-bold text-lg text-blue-700'>Todo List</h1>
          <Link href={`/new`}>
            <span className="ml-2 p-2 bg-blue-500 text-white cursor-pointer">Add Todo</span>
          </Link>
        </div>
        
        <ul>
          <li key="header" className="flex justify-between items-center p-2 border-b font-bold">
            <span>Title</span>
            <span>Description</span>
            <span>Action</span>
          </li>
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center p-2 border-b cursor-pointer">
              <Link href={`/todo/${todo.id}`}>
                <span>{todo.title}</span>
              </Link>
              <Link href={`/todo/${todo.id}`}>
                <span>{todo.description}</span>
              </Link>
              <div>
                <Link href={`/edit/${todo.id}`}>
                  <span className="text-green-500">Edit</span>
                </Link>
                <button className="text-red-500 pl-2" onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Todos;
