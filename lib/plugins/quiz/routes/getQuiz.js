/**
 * This plugin contains the route to get a quiz
*/
export default async function getQuiz (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/quizzes',
    schema: {},
    handler: getQuizHandler
  });

  async function getQuizHandler (req, reply) {
    reply.code(200).send({
      statusCode: 200,
      message: 'Quizzes retrieved successfully',
      data: {
        id: 1,
        name: 'test-quiz',
        questions: [{
          name: "What's your name?",
          answers: [
            {
              name: 'Fabrizio',
              isCorrect: true
            },
            {
              name: 'Giovanni',
              isCorrect: false
            },
            {
              name: 'Marco',
              isCorrect: false
            },
            {
              name: 'Luca',
              isCorrect: false
            }
          ]
        }]
      }
    });
  }
}
