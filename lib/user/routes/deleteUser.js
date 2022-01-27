/**
 * This plugin contains the route to delete a user
 */

import S from 'fluent-schema';

export default async function deleteUser (fastify, _opts) {
  const { deleteUserById } =
       fastify;

  fastify.route({
    method: 'DELETE',
    path: '/users/:id',
    schema: {

      params: S.object().prop('id', S.string().pattern('^[0-9]*$').not(S.null()).required())
    },
    handler: deleteUserHandler,
    preHandler: fastify.auth([fastify.verifyJWT])
  });

  async function deleteUserHandler (req, reply) {
    const deletedUser = await deleteUserById({ id: req.params.id });

    reply.code(200).send({
      statusCode: 200,
      message: 'User deleted successfully',
      data: {
        email: deletedUser.email
      }
    });
  }
}
