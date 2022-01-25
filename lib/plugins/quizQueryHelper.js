
import fp from 'fastify-plugin';

async function quizQueryHelper (fastify, _opts) {
  const { httpErrors } = fastify;
  fastify.decorate('buildCreateQuizQuery', buildCreateQuizQuery);
  fastify.decorate('updateQuizNameById', updateQuizNameById);
  fastify.decorate('updateQuestionsAndAnswers', updateQuestionsAndAnswers);
  fastify.decorate('getQuizById', getQuizById);

  function buildCreateQuizQuery ({ quiz }) {
    const questionsQuery = quiz.questions.map((question) => {
      question.answers = {
        create: [...question.answers]
      };

      return question;
    });

    const finalQuery = {
      data: {
        name: quiz.name,
        questions: {
          create: [...questionsQuery]
        }
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    };

    return finalQuery;
  }

  async function getQuizById ({ prisma, quizId }) {
    try {
      const quiz = await prisma.quiz.findUnique({
        where: {
          id: quizId
        },
        include: {
          questions: {
            include: {
              answers: true
            }
          }
        }
      });

      return quiz;
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

  async function updateQuizNameById ({ prisma, id, name }) {
    try {
      const updatedQuiz = await prisma.quiz.update({
        data: {
          name
        },
        where: {
          id
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
      for (const question of questions) {
        await prisma.question.update({
          data: {
            name: question.name
          },
          where: {
            id: question.id
          }
        });

        for (const answer of question.answers) {
          await prisma.answer.update({
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

export default fp(quizQueryHelper, {
  name: 'quizQueryHelper',
  dependencies: ['fastify-sensible']
})
;
