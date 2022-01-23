import S from 'fluent-schema';
/**
 * This plugin contains the route to delete a quiz
*/
export default async function deleteQuiz (fastify, opts) {
  const {
    httpErrors
  } = fastify;

  fastify.route({
    method: 'DELETE',
    path: '/quizzes/:id',
    schema: {
      params: S.object().prop('id', S.string().pattern('^[0-9]*$').not(S.null()).required())

    },
    handler: updateQuizHandler
  });

  async function updateQuizHandler (req, reply) {
    reply.code(200).send({
      statusCode: 200,
      message: `Quiz ${req.params.id} deleted successfully`,
      data: {}
    });
  }
}
