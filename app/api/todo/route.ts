import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';


export async function GET() {
  try {
    const todos = await prisma.todo.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

// Define the Zod schema for validating Todo data
const todoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

const updateTodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});



export async function POST(request: Request) {
  try {
    // Parse the request body
    const requestBody = await request.json();

    // Validate if the request body is empty
    if (!requestBody) {
      throw new Error('Empty request body');
    }

    // Validate the received data with the Zod schema
    const validatedData = todoSchema.parse(requestBody);

    // Create a new todo in the database using Prisma
    const newTodo = await prisma.todo.create({
      data: validatedData,
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);

    // Handle Zod validation errors separately
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ error: 'Error creating todo' }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    // Parse the request body
    const requestBody = await request.json();

    // Validate if the request body is empty
    if (!requestBody) {
      throw new Error('Empty request body');
    }

    // Validate the received data with the Zod schema for updates
    const validatedData = updateTodoSchema.parse(requestBody);

    // Extract the todo ID from validated data
    const { id, ...updateData } = validatedData;

    // Update the todo in the database using Prisma
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);

    // Handle Zod validation errors separately
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ error: 'Error updating todo' }, { status: 500 });
  }
}
const deleteTodoSchema = z.object({
  id: z.string(),
});


export async function DELETE(request: Request) {
  try {
    // Parse the request body
    const requestBody = await request.json();

    // Validate if the request body is empty
    if (!requestBody) {
      throw new Error('Empty request body');
    }

    // Validate the received data with the Zod schema for deletion
    const { id } = deleteTodoSchema.parse(requestBody);

    // Delete the todo from the database using Prisma
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(deletedTodo, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);

    // Handle Zod validation errors separately
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ error: 'Error deleting todo' }, { status: 500 });
  }
}