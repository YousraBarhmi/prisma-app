"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { date } from 'zod';

const AddTodoForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    assignedTo: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to add todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className='min-h-screen  p-20 '>
      <h1 className='font-bold text-lg text-blue-700'>Add Todo</h1>
      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8 ml-12">

        <div  className="flex flex-row items-baseline">
          <label>Title:</label>
          <input className="ml-4" type="text" name="title" value={formData.title} onChange={handleInputChange} />
        </div>

        <div  className="flex flex-row items-baseline">
          <label>Description:</label>
          <textarea className="ml-4" name="description" value={formData.description} onChange={handleInputChange} />
        </div>

        <div  className="flex flex-row items-baseline">
          <label>Priority:</label>
          <select className="ml-4" name="priority" value={formData.priority} onChange={handleSelectChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div  className="flex flex-row items-baseline">
          <label>Assigned To:</label>
          <input className="ml-4" type="text" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} />
        </div>

        <div  className="flex flex-row items-baseline">
          <label>Notes:</label>
          <input className="ml-4" type="text" name="notes" value={formData.notes} onChange={handleInputChange} />
        </div>

      </div>
        <button style={{ width: '20%' }} className='ml-10 p-2 bg-blue-500 text-white' type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export default AddTodoForm;
