import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const searchUsersService = async (query) => {
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  return users;
};

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  return users;
};
