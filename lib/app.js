import env from 'dotenv';
import Sensible from 'fastify-sensible';
import quiz from './quiz/index.js';
import user from './user/index.js';
import AutoLoad from 'fastify-autoload';
import Auth from 'fastify-auth';
import { join } from 'desm';
env.config();
/**
 * This is the entry point of the application
 */
export default async function (fastify, opts) {
  fastify.register(Auth);

  fastify.register(Sensible);

  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: Object.assign({}, opts)
  });


  fastify.register(user);
  fastify.register(quiz);
}
