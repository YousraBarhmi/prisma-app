-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT,
    "assignedTo" TEXT,
    "notes" TEXT,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
