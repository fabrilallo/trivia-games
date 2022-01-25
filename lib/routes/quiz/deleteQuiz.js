/**
 * This plugin contains the route to delete a quiz
*/
import S from 'fluent-schema';

export default async function deleteQuiz (fastify, opts) {
  const {
    deleteQuiz
  } = fastify;

  fastify.route({
    method: 'DELETE',
    path: '/quizzes/:id',
    schema: {
      params: S.object().prop('id', S.string().pattern('^[0-9]*$').not(S.null()).required())

    },
    handler: deleteQuizHandler
  });

  async function deleteQuizHandler (req, reply) {
    const deletedQuiz = await deleteQuiz(Number.parseInt(req.params.id));
    reply.code(200).send({
      statusCode: 200,
      message: `Quiz ${req.params.id} deleted successfully`,
      data: deletedQuiz
    });
  }
}
