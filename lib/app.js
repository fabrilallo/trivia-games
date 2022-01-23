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
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts)
  });
}
