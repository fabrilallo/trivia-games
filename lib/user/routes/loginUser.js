/**
 * This plugin contains the route to create a user
 */

import S from 'fluent-schema';

export default async function loginUser (fastify, _opts) {
  const { generateUserToken } =
      fastify;

  fastify.route({
    method: 'POST',
    path: '/login',
    schema: {
      body: S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email'))
        .prop('password', S.string().minLength(8).maxLength(16))
        .required(['email', 'password'])

    },
    preHandler: fastify.auth([fastify.verifyUsernameAndPassword]),
    handler: loginUser
  });

  async function loginUser (req, reply) {
    const user = req.user;

    const userToken = await generateUserToken({ userId: user.id });

    reply.code(200).send({
      statusCode: 200,
      message: 'You are authenticated',
      data: {
        email: userToken.email,
        token: userToken.token,
        createdAt: userToken.createdAt,
        updatedAt: userToken.updatedAt
      }
    });
  }
}
