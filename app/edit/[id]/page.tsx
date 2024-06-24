'use client'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema } from '@/lib/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect } from 'react';

interface EditTodo {
  params: {
    id: string;
  }
}

const fetchTodo = async (id: string) => {
  const response = await fetch(`/api/todo/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  const data = await response.json();
  return data; // Assuming the API returns the todo object directly
};

const updateTodo = async (data: todoSchema & { id: string }) => {
  const response = await fetch(`/api/todo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  return response.json();
};

const UpdateTodoForm: FC<EditTodo> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dataTodo, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
    enabled: !!id, 
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<todoSchema>({
    defaultValues: dataTodo,
    resolver: zodResolver(todoSchema),
  });

  useEffect(() => {
    if (dataTodo) {
      console.log("Fetched dataTodo:", dataTodo[0]); // Debugging line
      // dataTodo = dataTodo[0];
      setValue('title', dataTodo[0].title);
      setValue('description', dataTodo[0].description);
      setValue('priority', dataTodo[0].priority);
      setValue('assignedTo', dataTodo[0].assignedTo);
      setValue('notes', dataTodo[0].notes);
    }
  }, [dataTodo, setValue]);

  const mutation = useMutation({
    mutationKey: ['updateTodo'],
    mutationFn: (data: todoSchema & { id: string }) => updateTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      router.push('/');
    },
    onError: (error: Error) => {
      console.error('Error updating todo:', error.message);
    },
  });

  const onSubmit = (data: todoSchema) => {
    mutation.mutate({ ...data, id });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching todo: {error.message}</p>;
  }

  return (
    <div className="min-h-screen p-20">
      <h1 className="font-bold text-lg text-blue-700">Update Todo:</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8 ml-12">
          <div className="flex flex-row items-baseline">
            <label>Title:</label>
            <input className="ml-4" type="text" {...register('title')} />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>
          <div className="flex flex-row items-baseline">
            <label>Description:</label>
            <textarea className="ml-4" {...register('description')} />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>
          <div className="flex flex-row items-baseline">
            <label>Priority:</label>
            <select className="ml-4" {...register('priority')}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex flex-row items-baseline">
            <label>Assigned To:</label>
            <input className="ml-4" type="text" {...register('assignedTo')} />
          </div>
          <div className="flex flex-row items-baseline">
            <label>Notes:</label>
            <input className="ml-4" type="text" {...register('notes')} />
          </div>
        </div>
        <button type="submit" style={{ width: '20%' }} className="ml-10 p-2 bg-blue-500 text-white">Update Todo</button>
      </form>
    </div>
  );
};

export default UpdateTodoForm;