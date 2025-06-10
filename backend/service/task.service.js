import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTaskService = async ({
  title,
  description,
  assignedBy,
  assignedTo,
  status,
}) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      status: status || "TODO",
      assignedBy: { connect: { id: assignedBy } },
      assignedTo: { connect: { id: assignedTo } },
    },
  });
};

export const getTasksService = async (userId) => {
  const createdTasks = await prisma.task.findMany({
    where: { assignedById: userId },
  });
  const assignedTasks = await prisma.task.findMany({
    where: { assignedToId: userId },
  });

  return { createdTasks, assignedTasks };
};

export const updateTaskService = async ({
  id,
  title,
  description,
  status,
  userId,
}) => {
  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.assignedById !== userId && task.assignedToId !== userId) {
    throw new Error("Not authorized to update this task");
  }

  return await prisma.task.update({
    where: { id: parseInt(id) },
    data: { title, description, status },
  });
};
export const deleteTaskService = async ({ id, userId }) => {
  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(id),
      assignedById: userId,
    },
  });

  if (!task) {
    throw new Error("You're not authorized to delete it.");
  }

  return await prisma.task.delete({
    where: { id: task.id },
  });
};
