-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'DOING', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "TaskPriority" NOT NULL DEFAULT 'NO_PRIORITY',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_members" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "task_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_labels" (
    "id" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "labelId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "task_labels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_createdById_status_idx" ON "tasks"("createdById", "status");

-- CreateIndex
CREATE INDEX "tasks_createdById_priority_idx" ON "tasks"("createdById", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "task_members_taskId_userId_key" ON "task_members"("taskId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "labels_name_key" ON "labels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_labels_taskId_labelId_key" ON "task_labels"("taskId", "labelId");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_members" ADD CONSTRAINT "task_members_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_members" ADD CONSTRAINT "task_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
