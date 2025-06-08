import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [];

  // 1. Create 5 users
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const password = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    users.push(user);
  }

  // 2. Assign 3 tasks to each user (they assign and are assigned tasks)
  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      let assignedTo = faker.helpers.arrayElement(users);

      // prevent self-assignment
      while (assignedTo.id === user.id) {
        assignedTo = faker.helpers.arrayElement(users);
      }

      await prisma.task.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          isDone: faker.datatype.boolean(),
          assignedById: user.id, // 👈 user is assigning the task
          assignedToId: assignedTo.id, // 👈 assigned to another user
        },
      });
    }
  }

  console.log("🌱 Seeded users and their associated tasks successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Error seeding data:", err);
    prisma.$disconnect();
    process.exit(1);
  });
