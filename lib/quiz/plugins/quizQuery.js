
import fp from 'fastify-plugin';
async function quizQuery (fastify, _opts) {
  const {
    httpErrors,
    prismaClient,
    buildCreateQuizQuery
  } = fastify;

  fastify.decorate('createQuiz', createQuiz);
  fastify.decorate('deleteQuiz', deleteQuiz);
  fastify.decorate('getQuizzes', getQuizzes);
  fastify.decorate('updateQuiz', updateQuiz);
  fastify.decorate('updateQuizNameById', updateQuizNameById);
  fastify.decorate('updateQuestionsAndAnswers', updateQuestionsAndAnswers);
  fastify.decorate('getQuizById', getQuizById);

  async function createQuiz ({ prisma, quiz, userId }) {
    try {
      const client = prisma || prismaClient;

      const createQuizQuery = buildCreateQuizQuery({ quiz, userId });
      const newQuiz = await client.quiz.create(createQuizQuery);

      return newQuiz;
    } catch (error) {
      // prisma error code for record already present
      if (error.code && error.code === 'P2002') {
        throw httpErrors.conflict(
            `A quiz named ${quiz.name} already exists`
        );
      }

      throw httpErrors.internalServerError();
    }
  }

  async function deleteQuiz ({ prisma, id, userId }) {
    try {
      const client = prisma || prismaClient;

      return client.$transaction(async (prisma) => {
        const convertedId = Number.parseInt(id);
        await getQuizById({ prisma, quizId: id, userId });
        const deletedQuiz = await prisma.quiz.delete({
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
      });
    } catch (error) {
      // prisma error code for record not found
      if ((error.code && error.code === 'P2025') || error.name === 'NotFoundError') {
        throw httpErrors.notFound(
            `A quiz with id ${id} does not exist`
        );
      }

      throw httpErrors.internalServerError();
    }
  }

  async function getQuizzes ({ prisma, userId }) {
    try {
      const client = prisma || prismaClient;

      const quizzes = await client.quiz.findMany({
        where: {
          userId
        },
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

  async function updateQuiz ({ prisma, quizId, quiz, userId }) {
    try {
      const client = prisma || prismaClient;

      const convertedQuizId = Number.parseInt(quizId);
      return client.$transaction(async (prisma) => {
        /*
          NOTE: It's possible to update just the quiz name or both questions and answers or name, questions and answers at the same time.
        */

        // check if the quiz belongs to the user logged
        await getQuizById({ prisma, id: convertedQuizId, userId });
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

  async function getQuizById ({ prisma, quizId, userId }) {
    try {
      const client = prisma || prismaClient;

      const [quiz] = await client.quiz.findMany({
        where: {
          id: quizId,
          userId
        },
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      });

      if (quiz == undefined) { // eslint-disable-line eqeqeq
        throw httpErrors.notFound(
          `A quiz with id ${quizId} does not exist`
        );
      }
      return quiz;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw httpErrors.internalServerError();
    }
  }

  async function updateQuizNameById ({ prisma, id, name, userId }) {
    try {
      const client = prisma || prismaClient;

      const updatedQuiz = await client.quiz.update({
        data: {
          name
        },
        where: {
          id,
          userId
        },
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }

      });

      return updatedQuiz;
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
  async function updateQuestionsAndAnswers ({ prisma, questions }) {
    try {
      const client = prisma || prismaClient;

      for (const question of questions) {
        await client.question.update({
          data: {
            name: question.name
          },
          where: {
            id: question.id
          }
        });

        for (const answer of question.answers) {
          await client.answer.update({
            data: {
              name: answer.name,
              isCorrect: answer.isCorrect
            },
            where: {
              id: answer.id
            }
          });
        }
      }
    } catch (error) {
    // prisma error code for record not found
      if (error.code && error.code === 'P2025') {
        throw httpErrors.notFound(
          'Questions or answers not found'
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
