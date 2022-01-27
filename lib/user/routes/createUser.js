/**
 * This plugin contains the route to create a user
 */

import S from 'fluent-schema';

export default async function createUser (fastify, _opts) {
  const { createUserWithToken } =
     fastify;

  fastify.route({
    method: 'POST',
    path: '/users',
    schema: {
      body: S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email'))
        .prop('password', S.string().minLength(8).maxLength(16))
        .required(['email', 'password'])

    },
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: createQuizHandler
  });

  async function createQuizHandler (req, reply) {
    const { email, password } = req.body;

    const newUser = await createUserWithToken({ email, password });

    reply.code(201).send({
      statusCode: 201,
      message: 'User created successfully',
      data: {
        email,
        token: newUser.token,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt

      }
    });
  }
}
