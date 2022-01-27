/**
 * This plugin contains the route to get a quiz
*/

export default async function getQuizzes (fastify, _opts) {
  const { getQuizzes } = fastify;
  fastify.route({
    method: 'GET',
    path: '/quizzes',
    schema: {},
    preHandler: fastify.auth([fastify.verifyJWT]),
    handler: getQuizzesHandler
  });

  async function getQuizzesHandler (req, reply) {
    const user = req.user;

    const quizzes = await getQuizzes({ userId: user.id });

    reply.code(200).send({
      statusCode: 200,
      message: quizzes.length > 0 ? 'Quizzes retrieved successfully' : 'No quiz present',
      data: quizzes
    });
  }
}
