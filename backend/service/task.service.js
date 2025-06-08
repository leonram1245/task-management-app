import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTaskService = async ({ title, description, userId }) => {
  return await prisma.task.create({
    data: { title, description, userId },
  });
};

export const getTasksService = async (userId) => {
  return await prisma.task.findMany({
    where: { userId },
  });
};

export const updateTaskService = async ({ id, title, description, userId }) => {
  return await prisma.task.updateMany({
    where: { id: parseInt(id), userId },
    data: { title, description },
  });
};

export const deleteTaskService = async ({ id, userId }) => {
  return await prisma.task.deleteMany({
    where: { id: parseInt(id), userId },
  });
};
