/**
 * This plugin contains all the CRUD operations needed
 * to handle a quiz.
 */
export default async function quiz (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/quizzes',
    schema: {},
    handler: createQuiz
  });

  async function createQuiz (req, reply) {
    reply.code(200).send({ message: 'Quiz created correctly' });
  }
}
