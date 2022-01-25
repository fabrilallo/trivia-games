
import fp from 'fastify-plugin';
async function quizQuery (fastify, _opts) {
  const {
    httpErrors,
    prismaClient,
    buildCreateQuizQuery,
    getQuizById,
    updateQuestionsAndAnswers,
    updateQuizNameById
  } = fastify;

  fastify.decorate('createQuiz', createQuiz);
  fastify.decorate('deleteQuiz', deleteQuiz);
  fastify.decorate('getQuizzes', getQuizzes);
  fastify.decorate('updateQuiz', updateQuiz);

  async function createQuiz ({ quiz }) {
    try {
      const createQuizQuery = buildCreateQuizQuery({ quiz });
      const newQuiz = await prismaClient.quiz.create(createQuizQuery);

      return newQuiz;
    } catch (error) {
      // prisma error code for record already presen
      if (error.code && error.code === 'P2002') {
        throw httpErrors.conflict(
            `A quiz named ${quiz.name} already exists`
        );
      }

      throw httpErrors.internalServerError();
    }
  }

  async function deleteQuiz ({ id }) {
    try {
      const convertedId = Number.parseInt(id);
      const deletedQuiz = await prismaClient.quiz.delete({
        where: {
          id: convertedId
        },
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      });

      return deletedQuiz;
    } catch (error) {
      // prisma error code for record not found
      if (error.code && error.code === 'P2025') {
        throw httpErrors.notFound(
            `A quiz with id ${id} does not exist`
        );
      }

      throw httpErrors.internalServerError();
    }
  }

  async function getQuizzes () {
    try {
      const quizzes = await prismaClient.quiz.findMany({
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      });

      return quizzes;
    } catch (error) {
      throw httpErrors.internalServerError();
    }
  }

  async function updateQuiz ({ quizId, quiz }) {
    try {
      const convertedQuizId = Number.parseInt(quizId);
      return prismaClient.$transaction(async (prisma) => {
        /*
          NOTE: It's possible to update just the quiz name or both questions and answers or name, questions and answers at the same time.
        */
        if (quiz.name != undefined && !('questions' in quiz)) { // eslint-disable-line eqeqeq
          const quizUpdated = await updateQuizNameById({ prisma, id: convertedQuizId, name: quiz.name });
          return quizUpdated;
        } else if (quiz.name == undefined && 'questions' in quiz) { // eslint-disable-line eqeqeq
          await updateQuestionsAndAnswers({ prisma, questions: quiz.questions });
          const quizUpdated = await getQuizById({ prisma, id: convertedQuizId });

          return quizUpdated;
        } else {
          await updateQuizNameById({ prisma, id: convertedQuizId, name: quiz.name });
          await updateQuestionsAndAnswers({ prisma, questions: quiz.questions });

          const quizUpdated = await getQuizById({ prisma, id: convertedQuizId });

          return quizUpdated;
        }
      });
    } catch (error) {
      // prisma error code for record not found
      if (error.code && error.code === 'P2025') {
        throw httpErrors.notFound(
            `A quiz with id ${quizId} does not exist`
        );
      }

      throw httpErrors.internalServerError();
    }
  }
}

export default fp(quizQuery, {
  name: 'quizQuery',
  dependencies: ['prismaClient', 'fastify-sensible', 'quizQueryHelper']
})
;
