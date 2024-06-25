"use client"
import { todoSchema, Todo } from '@/lib/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';


const fetchTodos = async () => {
  const response = await fetch(`/api/todo`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  const data = await response.json();
  return data; // Assuming the API returns the todo object directly
};

const Todos = () => {
  const queryClient = useQueryClient();

  const { data: dataTodo, isLoading, error } = useQuery({
    queryKey: ['todo'],
    queryFn: () => fetchTodos(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });

      // QueryClient.invalidateQueries(['todos']);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
          {Array.isArray(dataTodo) && dataTodo.map((todo: Todo) => (
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
