"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const UpdateTodoForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    assignedTo: '',
    notes: '',
  }); // Initialize formData as null until data is fetched

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`/api/todo/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch todo');
        }
        const data = await response.json();
        setFormData(data[0]);
      } catch (error) {
        console.error('Error fetching todo:', error);
      }
    };

    if (id) {
      fetchTodo();
    }
  }, [id]);

  if (!formData) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/todo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/'); // Redirect to home page after successful update
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
//   console.log(formData)
  return (
    <div className='min-h-screen  p-20 '>
      <h1 className='font-bold text-lg text-blue-700'>Update Todo : </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8 ml-12">
            <div  className="flex flex-row items-baseline">
                <label>Title:</label>
                <input className="ml-4" type="text" value={formData.title} onChange={handleInputChange} />
            </div>
            <div  className="flex flex-row items-baseline">
                <label>Description:</label>
                <textarea className="ml-4" name="description" value={formData.description || ''} onChange={handleInputChange} />
            </div>
            <div  className="flex flex-row items-baseline">
                <label>Priority:</label>
                {/* <select name="priority" value={formData.priority || 'Low'} onChange={handleSelectChange}>
                */}
                <select className="ml-4" name="priority" value={formData.priority} onChange={handleSelectChange}>

                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div  className="flex flex-row items-baseline">
                <label>Assigned To:</label>
                <input className="ml-4" type="text" name="assignedTo" value={formData.assignedTo || ''} onChange={handleInputChange} />
            </div>
            <div  className="flex flex-row items-baseline">
                <label>Notes:</label>
                <input className="ml-4" type="text" name="notes" value={formData.notes || ''} onChange={handleInputChange} />
            </div>
        </div>
        <button type="submit" style={{ width: '20%' }} className='ml-10 p-2 bg-blue-500 text-white'>Update Todo</button>
      </form>
    </div>
  );
};

export default UpdateTodoForm;