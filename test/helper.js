
// This file contains code that we reuse
// between our tests.

import Fastify from 'fastify';
import fp from 'fastify-plugin';
import Sensible from 'fastify-sensible';
import Auth from 'fastify-auth';
import App from '../lib/app.js';
import quiz from '../lib/quiz/index.js';
import user from '../lib/user/index.js';
import prismaClient from '../lib/plugins/prismaClient.js';
import authentication from '../lib/plugins/authentication.js';

// Fill in this config with all the configurations
// needed for testing the application

process.env.JWT_SECRET = 'mytestsecret';

// automatically build and tear down our instance
export async function build (t, opts = {}) {
  const app = new Fastify();
  opts.prismaMock = buildPrismaMock(opts);

  await app.register(fp(App), { testing: true, ...opts });

  // tear down our app after we are done
  t.teardown(app.close.bind(app));

  return app;
}

export async function buildQuizPlugin (t, opts = {}) {
  const app = new Fastify();
  opts.prismaMock = buildPrismaMock(opts);
  await app.register(Auth);

  await app.register(Sensible);
  await app.register(prismaClient, { testing: true, ...opts });

  await app.register(authentication);

  await app.register(fp(quiz));

  // tear down our app after we are done
  t.teardown(app.close.bind(app));

  return app;
}

export async function buildUserPlugin (t, opts = {}) {
  const app = new Fastify();
  opts.prismaMock = buildPrismaMock(opts);
  await app.register(Auth);

  await app.register(Sensible);
  await app.register(prismaClient, { testing: true, ...opts });

  await app.register(authentication);
  await app.register(fp(user));

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
        },
    user: opts.user
      ? opts.user
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
