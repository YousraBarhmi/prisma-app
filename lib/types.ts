import { z } from 'zod';

export const todoSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string().max(200, { message: 'Description must not exceed 200 characters' }),
    priority: z.string().optional(),
    assignedTo: z.string().optional(),
    notes: z.string().optional(),
  });
  
  export type todoSchema = z.infer<typeof todoSchema>

  export interface Todo {
    id: string;
    title: string;
    description?: string;
    priority?: string;
    assignedTo?: string;
    notes?: string;
  }