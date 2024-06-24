"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema } from '@/lib/types';
import { useMutation, useQueryClient, MutationFunction } from '@tanstack/react-query';

const addTodo : MutationFunction<any, todoSchema> = async (data) => {
    const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to add todo');
    }

    return response.json();
};

const AddTodoForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm<todoSchema>({
        resolver: zodResolver(todoSchema),
    });

    const mutation = useMutation({
      mutationFn: addTodo,
      onSuccess: () => {
          // Invalider et refetch les todos pour s'assurer que l'UI est à jour
          queryClient.invalidateQueries({ queryKey: ['todos'] });
          router.push('/');
      },
        onError: (error: Error) => {
            console.error('Error adding todo:', error.message);
        },
    });

    const onSubmit = (data: todoSchema) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen p-20">
            <h1 className="font-bold text-lg text-blue-700">Add Todo</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8 ml-12">
                    <div className="flex flex-row items-baseline">
                        <label>Title:</label>
                        <input type="text" {...register('title')} className="ml-4" />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <div className="flex flex-row items-baseline">
                        <label>Description:</label>
                        <textarea {...register('description')} className="ml-4" />
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>
                    <div className="flex flex-row items-baseline">
                        <label>Priority:</label>
                        <select {...register('priority')} className="ml-4">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="flex flex-row items-baseline">
                        <label>Assigned To:</label>
                        <input type="text" {...register('assignedTo')} className="ml-4" />
                    </div>
                    <div className="flex flex-row items-baseline">
                        <label>Notes:</label>
                        <input type="text" {...register('notes')} className="ml-4" />
                    </div>
                </div>
                <button style={{ width: '20%' }} className="ml-10 p-2 bg-blue-500 text-white" type="submit">Add Todo</button>
            </form>
        </div>
    );
};

export default AddTodoForm;
