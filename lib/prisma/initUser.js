import pkg from '@prisma/client';

async function createUser () {
  const { PrismaClient } = pkg;

  const prismaClient = new PrismaClient({ log: ['error', 'warn'] });

  try {
    await prismaClient.user.create({
      data: {
        email: 'admin@example.com',
        password: '$2a$12$j/.kIn.hzgLg4KkEXTj1Ieu2jJg0fbCprSMloSaKS.BSwOg8CWAL6'
      }
    });
  } catch (error) {
    console.log(error);
  }
}

createUser();
