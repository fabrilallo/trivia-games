
// This file contains code that we reuse
// between our tests.

import Fastify from 'fastify';
import fp from 'fastify-plugin';
import App from '../lib/app.js';
// Fill in this config with all the configurations
// needed for testing the application
export function config () {
  return {};
}

// automatically build and tear down our instance
export async function build (t, opts = {}) {
  const app = new Fastify();
  opts.prismaMock = buildPrismaMock(opts);

  await app.register(fp(App), { testing: true, ...opts });

  // tear down our app after we are done
  t.teardown(app.close.bind(app));

  return app;
}

export function buildPrismaMock (opts) {
  const models = {
    quiz: opts.quiz
      ? opts.quiz
      : {
          create: () => {},
          update: () => {},
          findUnique: () => {},
          delete: () => {},
          findMany: () => {}
        },
    question: opts.question
      ? opts.question
      : {
          create: () => {},
          update: () => {},
          findUnique: () => {},
          delete: () => {},
          findMany: () => {}
        },
    answer: opts.answer
      ? opts.answer
      : {
          create: () => {},
          update: () => {},
          findUnique: () => {},
          delete: () => {},
          findMany: () => {}
        }
  };
  const prismaClient = {
    $connect: () => {},
    $disconnect: () => {},
    $transaction: opts.$transaction
      ? opts.$transaction
      : (fn) => fn({ ...models }),
    ...models

  };

  return prismaClient;
}
