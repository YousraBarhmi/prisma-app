import prisma from "@/lib/db";
import Image from "next/image";
import Todos from "./todo/Todo";

export default async function Home() {
  const todos = await prisma.todo.findMany()
  return (
    <main className=" min-h-screen  p-20">
      <Todos/>
    </main>
  );
}
