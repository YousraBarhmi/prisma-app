"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query'; // Ensure you are importing from '@tanstack/react-query'

const fetchTodo = async (id : string) => {
  const response = await fetch(`/api/todo/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  const data = await response.json();
  return data; // Assuming the API returns the todo object directly
};

const TodoById = () => {
  const { id } = useParams() as { id: string };


  const { data: todo = [], isLoading, error } = useQuery({
    queryKey: ['todo'],
    queryFn: () => fetchTodo(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
