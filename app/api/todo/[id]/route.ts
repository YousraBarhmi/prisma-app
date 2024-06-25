import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
// import { useParams } from 'next/navigation';


export async function GET(req : Request, context : any) {
  try {
    console.log(context.params.id)
    const todos = await prisma.todo.findUnique({
      where: { id: context.params.id },
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Error fetching todos' }, { status: 500 });
  }
}

