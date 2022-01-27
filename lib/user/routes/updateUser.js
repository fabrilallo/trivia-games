/**
 * This plugin contains the route to update a user
 */

import S from 'fluent-schema';

export default async function updateUser (fastify, _opts) {
  const { updateUserById } =
      fastify;

  fastify.route({
    method: 'PUT',
    path: '/users/:id',
    schema: {
      body: S.anyOf([S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email'))
        .prop('password', S.string().minLength(8).maxLength(8))
        .required(['email']),
      S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email'))
        .prop('password', S.string().minLength(8).maxLength(8))
        .required(['password']),
      S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email'))
        .prop('password', S.string().minLength(8).maxLength(16))
        .required(['email', 'password'])
      ]),
      params: S.object().prop('id', S.string().pattern('^[0-9]*$').not(S.null()).required())
    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: updateQuizHandler
  });

  async function updateQuizHandler (req, reply) {
    const updatedUser = await updateUserById({ id: req.params.id, data: { ...req.body } });

    reply.code(200).send({
      statusCode: 200,
      message: 'User updated successfully',
      data: {
        email: updatedUser.email,
        token: updatedUser.token,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  }
}
