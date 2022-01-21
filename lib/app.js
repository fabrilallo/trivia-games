import AutoLoad from 'fastify-autoload';
import Sensible from 'fastify-sensible';
import { join } from 'desm';

/**
 * This is the entry point of the application
 */
export default async function (fastify, opts) {
  fastify.register(Sensible);

  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: Object.assign({}, opts)
  });

  // Then, we'll load all of our routes.
  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes'),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts)
  });
}
