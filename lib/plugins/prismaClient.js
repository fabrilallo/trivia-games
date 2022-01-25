
import fp from 'fastify-plugin';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

async function prismaClient (fastify, opts) {
  let prismaClient;
  if (!opts.testing) {
    prismaClient = new PrismaClient({ log: ['error', 'warn'] });
  } else {
    prismaClient = { ...opts.prismaMock };
  }

  fastify.decorate('prismaClient', prismaClient);

  fastify.addHook('onClose', async (_instance) => {
    await prismaClient.$disconnect();
  });
}

export default fp(prismaClient, {
  name: 'prismaClient'
})
;
