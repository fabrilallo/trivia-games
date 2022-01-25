/**
 * This plugin contains the route to get a quiz
*/

export default async function getQuiz (fastify, _opts) {
  const { getQuizzes } = fastify;
  fastify.route({
    method: 'GET',
    path: '/quizzes',
    schema: {},
    handler: getQuizHandler
  });

  async function getQuizHandler (_req, reply) {
    const quizzes = await getQuizzes();

    reply.code(200).send({
      statusCode: 200,
      message: quizzes.length > 0 ? 'Quizzes retrieved successfully' : 'No quiz present',
      data: quizzes
    });
  }
}
