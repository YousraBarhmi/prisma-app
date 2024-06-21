"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const TodoById = () => {
  const router = useRouter();
  const { id } = useParams();
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    priority: 'Low',
    assignedTo: '',
    notes: '',
  }); 

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`/api/todo/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch todo');
        }
        const data = await response.json();
        setTodo(data[0]);
      } catch (error) {
        console.error('Error fetching todo:', error);
      }
    };

    if (id) {
      fetchTodo();
    }
  }, [id]);

  if (!todo) {
    return <p>Loading...</p>; 
  }

  return (
    <div className='min-h-screen  p-20 '>
      <h1 className='font-bold text-lg text-blue-700'>Todo Details : </h1>
      
      <div className='mt-4'>
      <div className="center">
        <div className="mt-4 p-4 border bg-gray-100">
          <p><strong>Title:</strong> {todo.title}</p>
          <p><strong>Description:</strong> {todo.description}</p>
          {todo.priority && <p><strong>Priority:</strong> {todo.priority}</p>}
          {todo.assignedTo && <p><strong>Assigned To:</strong> {todo.assignedTo}</p>}
          {todo.notes && <p><strong>Notes:</strong> {todo.notes}</p>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default TodoById;
